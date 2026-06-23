import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product';
import { buildProductSearchText, indexProducts, normalizeSearchText, searchIndexedProducts } from './productSearch';

const product: Product = {
  id: '1',
  slug: 'cesta-amor',
  name: 'Cesta Amor de Mãe',
  description: 'Uma opção romântica para presentear.',
  longDescription: 'Composição especial para maternidade.',
  price: 249.9,
  category: 'presentes',
  subcategory: 'romanticas',
  tag: 'Edição Especial',
  images: ['image.jpg'],
  includedItems: ['Ferrero Rocher', 'Café gourmet'],
  keywords: ['dia das mães', 'amor'],
};

describe('product search', () => {
  it('normalizes accents, casing and simple special characters', () => {
    expect(normalizeSearchText('  MÃE / Café!  ')).toBe('mae cafe');
  });

  it('indexes all searchable product fields', () => {
    const searchText = buildProductSearchText(product);

    expect(searchText).toContain('cesta amor de mae');
    expect(searchText).toContain('ferrero rocher');
    expect(searchText).toContain('romanticas');
    expect(searchText).toContain('cestas de presentes');
    expect(searchText).toContain('dia das maes');
  });

  it.each(['mae', 'cafe', 'romantica', 'ferrero', 'maternidade', 'edicao especial'])(
    'finds the product using "%s"',
    (query) => {
      expect(searchIndexedProducts(indexProducts([product]), query)).toEqual([product]);
    },
  );

  it('requires every search term to match', () => {
    expect(searchIndexedProducts(indexProducts([product]), 'ferrero romantica')).toEqual([product]);
    expect(searchIndexedProducts(indexProducts([product]), 'ferrero vinho')).toEqual([]);
  });
});
