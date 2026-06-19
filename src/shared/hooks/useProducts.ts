import { useEffect, useMemo, useRef, useState } from 'react';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { isFirebaseConfigured } from '../services/firebase';
import {
  getCatalogProductCount,
  getCatalogProductPage,
  getCatalogProductsWithoutCompositeIndex,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
  searchCatalogProducts,
  subscribeProducts,
  type CatalogFilters,
} from '../services/products';
import type { Product } from '../types/product';

type AsyncProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

const emptyState: AsyncProductsState = { products: [], loading: true, error: null };

export function useFeaturedProducts() {
  const [state, setState] = useState<AsyncProductsState>(emptyState);

  useEffect(() => {
    let active = true;
    if (!isFirebaseConfigured) {
      setState({ products: [], loading: false, error: null });
      return undefined;
    }

    getFeaturedProducts()
      .then((products) => active && setState({ products, loading: false, error: null }))
      .catch((error: Error) => active && setState({ products: [], loading: false, error: error.message }));

    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function useProductDetails(slug?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(Boolean(slug && isFirebaseConfigured));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setRelatedProducts([]);

    if (!slug || !isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    getProductBySlug(slug)
      .then(async (nextProduct) => {
        if (!active) return;
        setProduct(nextProduct);
        setLoading(false);
        if (!nextProduct) return;
        const related = await getRelatedProducts(nextProduct);
        if (active) setRelatedProducts(related);
      })
      .catch((requestError: Error) => {
        if (!active) return;
        setError(requestError.message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return { product, relatedProducts, loading, error };
}

type UseCatalogProductsOptions = CatalogFilters & {
  page: number;
  search: string;
};

export function useCatalogProducts(options: UseCatalogProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const pageCache = useRef(new Map<number, { products: Product[]; lastDocument: QueryDocumentSnapshot<DocumentData> | null }>());
  const countCache = useRef(new Map<string, number>());
  const filterKey = `${options.category}|${options.subcategory}|${options.sort}|${options.pageSize}`;
  const previousFilterKey = useRef(filterKey);
  const normalizedSearch = options.search.trim().toLowerCase();

  useEffect(() => {
    if (previousFilterKey.current !== filterKey) {
      pageCache.current.clear();
      previousFilterKey.current = filterKey;
    }
  }, [filterKey]);

  useEffect(() => {
    let active = true;

    if (!isFirebaseConfigured) {
      setProducts([]);
      setTotalProducts(0);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    async function load() {
      if (normalizedSearch) {
        const searchableProducts = await searchCatalogProducts(options);
        const filtered = searchableProducts.filter((product) =>
          [product.name, product.description, product.tag, ...product.includedItems]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch),
        );
        const sorted = sortProducts(filtered, options.sort);
        const start = (options.page - 1) * options.pageSize;
        if (!active) return;
        setProducts(sorted.slice(start, start + options.pageSize));
        setTotalProducts(sorted.length);
        setLoading(false);
        return;
      }

      try {
        const cachedPage = pageCache.current.get(options.page);
        const cachedCount = countCache.current.get(filterKey);
        if (cachedPage) {
          const count = cachedCount ?? await getCatalogProductCount(options);
          countCache.current.set(filterKey, count);
          if (!active) return;
          setProducts(cachedPage.products);
          setTotalProducts(count);
          setLoading(false);
          return;
        }

        let pageToLoad = 1;
        let cursor: QueryDocumentSnapshot<DocumentData> | null = null;
        for (const [page, cached] of pageCache.current) {
          if (page < options.page && page >= pageToLoad) {
            pageToLoad = page + 1;
            cursor = cached.lastDocument;
          }
        }

        while (pageToLoad <= options.page) {
          const result = await getCatalogProductPage(options, cursor);
          pageCache.current.set(pageToLoad, result);
          cursor = result.lastDocument;
          pageToLoad += 1;
        }

        const count = cachedCount ?? await getCatalogProductCount(options);
        countCache.current.set(filterKey, count);
        const requestedPage = pageCache.current.get(options.page);
        if (!active) return;
        setProducts(requestedPage?.products ?? []);
        setTotalProducts(count);
        setLoading(false);
      } catch (requestError) {
        if (!isMissingIndexError(requestError)) throw requestError;

        const fallbackProducts = await getCatalogProductsWithoutCompositeIndex(options);
        const start = (options.page - 1) * options.pageSize;
        if (!active) return;
        setProducts(fallbackProducts.slice(start, start + options.pageSize));
        setTotalProducts(fallbackProducts.length);
        setLoading(false);
      }
    }

    load().catch((requestError: Error) => {
      if (!active) return;
      setError(requestError.message);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [
    filterKey,
    normalizedSearch,
    options.category,
    options.page,
    options.pageSize,
    options.sort,
    options.subcategory,
  ]);

  return { products, totalProducts, loading, error };
}

function isMissingIndexError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes('requires an index') ||
    error.message.includes('failed-precondition') ||
    error.message.includes('create_composite')
  );
}

function sortProducts(products: Product[], sort: CatalogFilters['sort']) {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    const featuredDifference = Number(b.featured) - Number(a.featured);
    if (featuredDifference) return featuredDifference;
    const orderDifference = (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999);
    return orderDifference || a.name.localeCompare(b.name);
  });
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    return subscribeProducts(
      (items) => {
        setProducts(items);
        setError(null);
        setLoading(false);
      },
      (firebaseError) => {
        setError(firebaseError.message);
        setLoading(false);
      },
    );
  }, []);

  return {
    products: useMemo(() => products, [products]),
    loading,
    error,
  };
}
