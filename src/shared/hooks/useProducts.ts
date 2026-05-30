import { useEffect, useMemo, useState } from 'react';
import { products as mockProducts } from '../mocks/products';
import { isFirebaseConfigured } from '../services/firebase';
import { subscribeProducts } from '../services/products';
import type { Product } from '../types/product';

type UseProductsOptions = {
  includeUnavailable?: boolean;
  fallbackToMocks?: boolean;
};

export function useProducts(options: UseProductsOptions = {}) {
  const fallbackToMocks = options.fallbackToMocks ?? true;
  const [products, setProducts] = useState<Product[]>(fallbackToMocks ? mockProducts : []);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setProducts(fallbackToMocks ? mockProducts : []);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = subscribeProducts(
      (items) => {
        setProducts(items.length || !fallbackToMocks ? items : mockProducts);
        setError(null);
        setLoading(false);
      },
      (firebaseError) => {
        setError(firebaseError.message);
        setProducts(fallbackToMocks ? mockProducts : []);
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
