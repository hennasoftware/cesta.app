import { describe, expect, it } from 'vitest';
import { brand } from '../config/brand';
import {
  buildWhatsAppUrl,
  catalogSuggestionMessage,
  customOrderMessage,
  formatCurrency,
  productOrderMessage,
  qualifiedProductOrderMessage,
} from './whatsapp';

describe('whatsapp service', () => {
  it('builds WhatsApp URLs with encoded message and configured number', () => {
    const url = buildWhatsAppUrl('Ola teste');

    expect(url).toContain(`https://wa.me/${brand.whatsappNumber}`);
    expect(url).toContain('Ola%20teste');
  });

  it('creates product and custom order messages with brand name', () => {
    expect(productOrderMessage('Cesta especial')).toContain(brand.name);
    expect(productOrderMessage('Cesta especial')).toContain('Cesta especial');
    expect(customOrderMessage()).toContain('pedido personalizado');
  });

  it('formats currency in pt-BR', () => {
    expect(formatCurrency(129.9)).toContain('129,90');
  });

  it('creates a catalog suggestion message with active filters', () => {
    const message = catalogSuggestionMessage({
      search: 'Ferrero Rocher',
      category: 'Presentes',
      subcategory: 'Românticas',
    });

    expect(message).toContain('Busca: Ferrero Rocher');
    expect(message).toContain('Categoria: Presentes');
    expect(message).toContain('Subcategoria: Românticas');
    expect(message).toContain('Poderiam me indicar uma opção?');
  });

  it('omits inactive filters from the catalog suggestion message', () => {
    const message = catalogSuggestionMessage();

    expect(message).not.toContain('Busca:');
    expect(message).not.toContain('Categoria:');
    expect(message).not.toContain('Subcategoria:');
  });

  it('creates a qualified product message with catalog and delivery data', () => {
    const message = qualifiedProductOrderMessage({
      productName: 'Cesta Amor Perfeito',
      productPrice: 249.9,
      productUrl: 'https://site.com/produto/cesta-amor-perfeito',
      deliveryDate: '2026-07-15',
      location: 'Centro - 14800-000',
      personalization: 'Cartão com mensagem e embalagem rosa',
    });

    expect(message).toContain('Produto: Cesta Amor Perfeito');
    expect(message).toContain(`Preço: ${formatCurrency(249.9)}`);
    expect(message).toContain('Link: https://site.com/produto/cesta-amor-perfeito');
    expect(message).toContain('Data desejada: 15/07/2026');
    expect(message).toContain('Bairro/CEP: Centro - 14800-000');
    expect(message).toContain('Personalização: Cartão com mensagem e embalagem rosa');
  });

  it('omits personalization when it is not informed', () => {
    const message = qualifiedProductOrderMessage({
      productName: 'Cesta Especial',
      productPrice: 100,
      productUrl: 'https://site.com/produto/cesta-especial',
      deliveryDate: '2026-07-15',
      location: 'Centro',
    });

    expect(message).not.toContain('Personalização:');
  });
});
