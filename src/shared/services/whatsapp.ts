const PHONE_NUMBER = '5512999999999';

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(productName: string) {
  return `Olá, gostaria de pedir a cesta ${productName}.`;
}

export function customOrderMessage() {
  return 'Olá, gostaria de montar um pedido personalizado com a Cesta.com.';
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
