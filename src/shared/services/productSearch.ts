import { getCategoryName, getSubcategoryName } from '../config/categories';
import type { Product } from '../types/product';

export type IndexedProduct = {
  product: Product;
  searchText: string;
};

export function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function buildProductSearchText(product: Product) {
  return normalizeSearchText(
    [
      product.name,
      product.description,
      product.longDescription,
      ...product.includedItems,
      getCategoryName(product.category),
      getCategoryName(product.category, true),
      getSubcategoryName(product.subcategory) ?? '',
      product.tag,
      ...(product.keywords ?? []),
    ].join(' '),
  );
}

export function indexProducts(products: Product[]): IndexedProduct[] {
  return products.map((product) => ({
    product,
    searchText: buildProductSearchText(product),
  }));
}

export function searchIndexedProducts(indexedProducts: IndexedProduct[], query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return indexedProducts.map(({ product }) => product);

  const terms = normalizedQuery.split(' ');
  return indexedProducts
    .filter(({ searchText }) => terms.every((term) => searchText.includes(term)))
    .map(({ product }) => product);
}
