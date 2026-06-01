import { describe, expect, it } from 'vitest';
import { brand } from '../config/brand';
import { buildWhatsAppUrl, customOrderMessage, formatCurrency, productOrderMessage } from './whatsapp';

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
});
