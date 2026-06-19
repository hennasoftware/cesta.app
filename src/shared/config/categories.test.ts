import { describe, expect, it } from 'vitest';
import {
  isProductSubcategory,
  normalizeCategoryFilter,
  normalizeProductClassification,
} from './categories';

describe('category compatibility', () => {
  it('keeps the current category and subcategory schema', () => {
    expect(normalizeProductClassification('presentes', 'aniversarios')).toEqual({
      category: 'presentes',
      subcategory: 'aniversarios',
    });
  });

  it('maps legacy breakfast products to the new category', () => {
    expect(normalizeProductClassification('cafe')).toEqual({
      category: 'cafe-da-manha',
      subcategory: null,
    });
  });

  it('maps the legacy romantic category to presents', () => {
    expect(normalizeProductClassification('romanticas')).toEqual({
      category: 'presentes',
      subcategory: 'romanticas',
    });
  });

  it('accepts products without a subcategory', () => {
    expect(normalizeProductClassification('presentes')).toEqual({
      category: 'presentes',
      subcategory: null,
    });
  });

  it('normalizes labels used by existing or imported data', () => {
    expect(normalizeProductClassification('presentes', 'Promoção/Graduação')).toEqual({
      category: 'presentes',
      subcategory: 'promocao-graduacao',
    });
    expect(isProductSubcategory('Românticas')).toBe(true);
  });

  it('supports legacy category URLs without accepting invalid filters', () => {
    expect(normalizeCategoryFilter('cafe')).toBe('cafe-da-manha');
    expect(normalizeCategoryFilter('categoria-inexistente')).toBeNull();
  });
});
