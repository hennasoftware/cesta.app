import type { ProductCategory, ProductSubcategory } from '../types/product';

export type ProductSubcategoryDefinition = {
  id: ProductSubcategory;
  name: string;
};

export type ProductCategoryDefinition = {
  id: ProductCategory;
  name: string;
  shortName: string;
  subcategories?: readonly ProductSubcategoryDefinition[];
};

export const giftSubcategories: readonly ProductSubcategoryDefinition[] = [
  { id: 'romanticas', name: 'Românticas' },
  { id: 'aniversarios', name: 'Aniversários' },
  { id: 'maternidade', name: 'Maternidade' },
  { id: 'promocao-graduacao', name: 'Promoção/Graduação' },
  { id: 'tematicas', name: 'Temáticas' },
];

export const productCategories: readonly ProductCategoryDefinition[] = [
  {
    id: 'cafe-da-manha',
    name: 'Cesta de Café da Manhã',
    shortName: 'Café da Manhã',
  },
  {
    id: 'vinho-e-frios',
    name: 'Cesta de Vinho e Frios',
    shortName: 'Vinho e Frios',
  },
  {
    id: 'presentes',
    name: 'Cestas de Presentes',
    shortName: 'Presentes',
    subcategories: giftSubcategories,
  },
];

const categoryIds = new Set<ProductCategory>(productCategories.map((category) => category.id));
const subcategoryIds = new Set<ProductSubcategory>(giftSubcategories.map((subcategory) => subcategory.id));

const legacyCategories: Record<string, { category: ProductCategory; subcategory: ProductSubcategory | null }> = {
  cafe: { category: 'cafe-da-manha', subcategory: null },
  romanticas: { category: 'presentes', subcategory: 'romanticas' },
  personalizados: { category: 'presentes', subcategory: null },
  corporativos: { category: 'presentes', subcategory: null },
  'datas-especiais': { category: 'presentes', subcategory: null },
};

function normalizeId(value: unknown) {
  if (typeof value !== 'string') return '';

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function isProductCategory(value: unknown): value is ProductCategory {
  return categoryIds.has(normalizeId(value) as ProductCategory);
}

export function isProductSubcategory(value: unknown): value is ProductSubcategory {
  return subcategoryIds.has(normalizeId(value) as ProductSubcategory);
}

export function normalizeCategoryFilter(value: unknown): ProductCategory | null {
  const categoryId = normalizeId(value);
  return legacyCategories[categoryId]?.category ?? (isProductCategory(categoryId) ? categoryId : null);
}

export function normalizeProductClassification(categoryValue: unknown, subcategoryValue?: unknown) {
  const categoryId = normalizeId(categoryValue);
  const legacyClassification = legacyCategories[categoryId];
  const category = normalizeCategoryFilter(categoryId) ?? 'presentes';

  if (category !== 'presentes') {
    return { category, subcategory: null } as const;
  }

  const normalizedSubcategory = normalizeId(subcategoryValue);
  const subcategory = isProductSubcategory(normalizedSubcategory)
    ? normalizedSubcategory
    : legacyClassification?.subcategory ?? null;

  return { category, subcategory };
}

export function getCategoryName(category: ProductCategory, short = false) {
  const definition = productCategories.find((item) => item.id === category);
  return short ? definition?.shortName ?? category : definition?.name ?? category;
}

export function getSubcategoryName(subcategory?: ProductSubcategory | null) {
  if (!subcategory) return null;
  return giftSubcategories.find((item) => item.id === subcategory)?.name ?? subcategory;
}
