const PHONE_NUMBER = '5512991706194';

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(productName: string) {
  return [
    'Ola, Cesta.com.',
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

export function customOrderMessage() {
  return [
    'Ola, Cesta.com.',
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
