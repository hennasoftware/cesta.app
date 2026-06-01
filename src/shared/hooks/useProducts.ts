import { useEffect, useMemo, useState } from 'react';
import { products as mockProducts } from '../mocks/products';
import { isFirebaseConfigured } from '../services/firebase';
import { subscribeProducts } from '../services/products';
import type { Product } from '../types/product';

type UseProductsOptions = {
  includeUnavailable?: boolean;
  fallbackToMocks?: boolean;
};

const PRODUCTS_CACHE_KEY = 'cesta.products.cache';

function readCachedProducts() {
  if (typeof window === 'undefined') return [];

  try {
    const cached = window.localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (!cached) return [];

    const products = JSON.parse(cached) as Product[];
    return products.map((product) => ({
      ...product,
      createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
    }));
  } catch {
    return [];
  }
}

function writeCachedProducts(products: Product[]) {
  try {
    window.localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(products));
  } catch {
    // Cache is an optimization only; ignore storage failures.
  }
}

export function useProducts(options: UseProductsOptions = {}) {
  const fallbackToMocks = options.fallbackToMocks ?? true;
  const [cachedProducts] = useState(readCachedProducts);
  const [products, setProducts] = useState<Product[]>(cachedProducts.length ? cachedProducts : fallbackToMocks ? mockProducts : []);
  const [loading, setLoading] = useState(isFirebaseConfigured && cachedProducts.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setProducts(fallbackToMocks ? mockProducts : []);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = subscribeProducts(
      (items) => {
        const nextProducts = items.length || !fallbackToMocks ? items : mockProducts;
        setProducts(nextProducts);
        if (items.length) writeCachedProducts(items);
        setError(null);
        setLoading(false);
      },
      (firebaseError) => {
        const cachedProducts = readCachedProducts();
        setError(firebaseError.message);
        setProducts(cachedProducts.length ? cachedProducts : fallbackToMocks ? mockProducts : []);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [fallbackToMocks]);

  const visibleProducts = useMemo(() => {
    if (options.includeUnavailable) return products;
    return products.filter((product) => product.available !== false);
  }, [options.includeUnavailable, products]);

  return { products: visibleProducts, loading, error };
}
