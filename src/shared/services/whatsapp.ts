import { brand } from '../config/brand';

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(productName: string) {
  return [
    `Ola, ${brand.name}.`,
    '',
    `Tenho interesse no produto: ${productName}.`,
    '',
    'Gostaria de confirmar:',
    '- Disponibilidade para a data desejada',
    '- Opcoes de personalizacao',
    '- Prazo e valor da entrega',
    '- Formas de pagamento',
    '',
    'Aguardo o atendimento para finalizar o pedido. Obrigado(a).',
  ].join('\n');
}

type QualifiedProductOrder = {
  productName: string;
  productPrice: number;
  productUrl: string;
  deliveryDate: string;
  location: string;
  personalization?: string;
};

function formatDeliveryDate(value: string) {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function qualifiedProductOrderMessage({
  productName,
  productPrice,
  productUrl,
  deliveryDate,
  location,
  personalization,
}: QualifiedProductOrder) {
  return [
    `Olá, ${brand.name}! Tenho interesse na seguinte cesta:`,
    '',
    `Produto: ${productName}`,
    `Preço: ${formatCurrency(productPrice)}`,
    `Link: ${productUrl}`,
    '',
    `Data desejada: ${formatDeliveryDate(deliveryDate)}`,
    `Bairro/CEP: ${location.trim()}`,
    personalization?.trim() ? `Personalização: ${personalization.trim()}` : null,
    '',
    'Gostaria de mais informações.',
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}

export function customOrderMessage() {
  return [
    `Ola, ${brand.name}.`,
    '',
    'Gostaria de montar um pedido personalizado.',
    '',
    'Preciso de ajuda para escolher a melhor composicao considerando:',
    '- Ocasiao ou motivo do presente',
    '- Preferencias da pessoa presenteada',
    '- Data desejada para entrega',
    '- Faixa de investimento',
    '',
    'Aguardo o atendimento para receber uma sugestao personalizada. Obrigado(a).',
  ].join('\n');
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
