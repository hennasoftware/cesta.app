import type { Category, Product } from '../types/product';

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

export const categories: Category[] = [
  {
    id: 'cafe-da-manha',
    name: 'Cesta de Café da Manhã',
    description: 'Manhãs especiais com sabores selecionados.',
    image: img('photo-1506368249639-73a05d6f6488'),
  },
  {
    id: 'vinho-e-frios',
    name: 'Cesta de Vinho e Frios',
    description: 'Sabores especiais para encontros e celebrações.',
    image: img('photo-1515169067865-5387ec356754'),
  },
  {
    id: 'presentes',
    name: 'Cestas de Presentes',
    description: 'Composições afetivas para cada ocasião.',
    image: img('photo-1518199266791-5375a83190b7'),
  },
];

export const products: Product[] = [
  {
    id: '1',
    slug: 'cafe-da-manha-especial',
    name: 'Café da Manhã Especial',
    description: 'Cesta premium com pães artesanais, frutas, geleias e café gourmet.',
    longDescription:
      'Uma experiência completa para transformar o começo do dia em um gesto memorável. Montada artesanalmente com produtos frescos, embalagem elegante e cartão personalizado.',
    price: 189.9,
    category: 'cafe-da-manha',
    subcategory: null,
    tag: 'Mais pedido',
    featured: true,
    rating: 4.9,
    images: [
      img('photo-1495474472287-4d71bcdd2085'),
      img('photo-1484723091739-30a097e8f929'),
      img('photo-1525351484163-7529414344d8'),
    ],
    includedItems: ['Café gourmet', 'Croissants', 'Frutas frescas', 'Geleia artesanal', 'Cartão afetivo'],
  },
  {
    id: '2',
    slug: 'cesta-romantica-premium',
    name: 'Cesta Romântica Premium',
    description: 'Flores, espumante, chocolates finos e detalhes em rosé.',
    longDescription:
      'Criada para surpreender com elegância. Combina flores delicadas, chocolates gourmet, bebida especial e acabamento premium para datas românticas.',
    price: 279.9,
    category: 'presentes',
    subcategory: 'romanticas',
    tag: 'Premium',
    featured: true,
    rating: 5,
    images: [
      img('photo-1518895949257-7621c3c786d7'),
      img('photo-1526047932273-341f2a7631f9'),
      img('photo-1529257414779-1960b7bea4eb'),
    ],
    includedItems: ['Flores naturais', 'Chocolates gourmet', 'Espumante', 'Vela aromática', 'Mensagem personalizada'],
  },
  {
    id: '3',
    slug: 'box-chocolates-gourmet',
    name: 'Box Chocolates Gourmet',
    description: 'Seleção sofisticada de chocolates, trufas e nuts caramelizadas.',
    longDescription:
      'Um box elegante para presentear com sabor e presença. Ideal para agradecimentos, aniversários e pequenas celebrações com acabamento refinado.',
    price: 149.9,
    category: 'presentes',
    subcategory: 'tematicas',
    tag: 'Novo',
    rating: 4.8,
    images: [
      img('photo-1549007994-cb92caebd54b'),
      img('photo-1606312619070-d48b4c652a52'),
      img('photo-1604514813560-1e4f5726db65'),
    ],
    includedItems: ['Trufas sortidas', 'Chocolate belga', 'Nuts caramelizadas', 'Laço premium', 'Tag personalizada'],
  },
  {
    id: '4',
    slug: 'kit-cafe-colonial',
    name: 'Kit Café Colonial',
    description: 'Sabores de padaria afetiva com bolos, frios, sucos e quitutes.',
    longDescription:
      'Uma composição generosa com clima de mesa posta. Une sabores clássicos, itens frescos e uma curadoria acolhedora para compartilhar.',
    price: 229.9,
    category: 'cafe-da-manha',
    subcategory: null,
    tag: 'Família',
    rating: 4.9,
    images: [
      img('photo-1525351484163-7529414344d8'),
      img('photo-1551024506-0bccd828d307'),
      img('photo-1509440159596-0249088772ff'),
    ],
    includedItems: ['Bolo caseiro', 'Pães artesanais', 'Frios selecionados', 'Suco integral', 'Biscoitos finos'],
  },
  {
    id: '5',
    slug: 'cesta-aniversario-luxo',
    name: 'Cesta Aniversário Luxo',
    description: 'Balões, doces finos, bebida especial e embalagem de alto impacto.',
    longDescription:
      'Pensada para criar uma entrega especial e fotogênica. Mistura doces premium, bebida comemorativa e detalhes visuais que tornam o presente inesquecível.',
    price: 319.9,
    category: 'presentes',
    subcategory: 'aniversarios',
    tag: 'Luxo',
    featured: true,
    rating: 5,
    images: [
      img('photo-1513151233558-d860c5398176'),
      img('photo-1464349095431-e9a21285b5f3'),
      img('photo-1519654793190-2e8a4806f1f2'),
    ],
    includedItems: ['Mini bolo', 'Balões decorativos', 'Doces finos', 'Espumante', 'Embalagem luxo'],
  },
  {
    id: '6',
    slug: 'kit-corporativo-afeto',
    name: 'Kit Corporativo Afeto',
    description: 'Curadoria gourmet para onboarding, eventos e relacionamento.',
    longDescription:
      'Uma solução corporativa elegante para marcas que desejam demonstrar cuidado. Personalizável com identidade visual, cartão institucional e itens gourmet.',
    price: 199.9,
    category: 'presentes',
    subcategory: 'promocao-graduacao',
    tag: 'Empresas',
    rating: 4.7,
    images: [
      img('photo-1549465220-1a8b9238cd48'),
      img('photo-1515169067865-5387ec356754'),
      img('photo-1607083206869-4c7672e72a8a'),
    ],
    includedItems: ['Café especial', 'Cookies premium', 'Caneca', 'Cartão institucional', 'Caixa personalizada'],
  },
];

export const testimonials = [
  {
    name: 'Mariana Alves',
    text: 'A cesta chegou impecável. Minha mãe ficou emocionada com cada detalhe.',
    rating: 5,
  },
  {
    name: 'Renato Lima',
    text: 'Atendimento rápido, elegante e muito cuidadoso. Virou meu presente oficial.',
    rating: 5,
  },
  {
    name: 'Clara Monteiro',
    text: 'Pedi uma composição personalizada e superou a expectativa. Visual lindo.',
    rating: 5,
  },
];
