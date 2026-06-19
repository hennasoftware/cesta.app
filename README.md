# Cesta.com - Catálogo Virtual

Aplicação web para catálogo virtual da Cesta.com, empresa de Guaratinguetá - SP especializada em cestas de café da manhã, presentes personalizados e kits afetivos.

Slogan: **Conectando afetos**

## Visão Geral

O projeto entrega uma experiência responsiva com foco em conversão via WhatsApp. A interface combina estética premium, navegação simples, catálogo filtrável e páginas de detalhe para apresentar produtos de forma sofisticada e emocional.

## Funcionalidades

- Landing page com hero, categorias, diferenciais, passo a passo e depoimentos.
- Catálogo com busca, filtro por categoria e ordenação.
- Página dinâmica de detalhes do produto.
- Botões de pedido com mensagem pré-preenchida para WhatsApp.
- Menu mobile com animações, ícones e navegação por seções.
- Barra inferior mobile com atalhos principais.
- Dark mode.
- Botão flutuante para voltar ao topo.
- Animações e transições com Framer Motion.

## Stack

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Framer Motion
- Lucide React

## Estrutura

```text
src/
  app/
    App.tsx
  modules/
    catalog/
      pages/
    home/
      pages/
  shared/
    components/
      cards/
      layout/
      ui/
    hooks/
    mocks/
    services/
    types/
  styles/
    globals.css
```

## Como Executar

Instale as dependências:

```bash
npm install
```

Execute em desenvolvimento:

```bash
npm run dev
```

Gere o build de produção:

```bash
npm run build
```

Pré-visualize o build:

```bash
npm run preview
```

## Configuração do WhatsApp

O número usado nos links do WhatsApp está em:

```text
src/shared/services/whatsapp.ts
```

Atualize `PHONE_NUMBER` com o número oficial da empresa no formato internacional, sem espaços ou símbolos.

Exemplo:

```ts
const PHONE_NUMBER = '5512999999999';
```

## Categorias no Firestore

Os documentos da coleção `products` usam a seguinte classificação:

```ts
category: 'cafe-da-manha' | 'vinho-e-frios' | 'presentes';
subcategory:
  | 'romanticas'
  | 'aniversarios'
  | 'maternidade'
  | 'promocao-graduacao'
  | 'tematicas'
  | null;
```

`subcategory` deve ser `null` para café da manhã e vinho e frios. A aplicação mantém
compatibilidade de leitura com os IDs antigos (`cafe`, `romanticas`, `personalizados`,
`corporativos` e `datas-especiais`). Ao editar um produto legado no painel, o documento
é salvo no formato novo, permitindo migração gradual sem interromper o catálogo.

## Observações

- Os mocks de produtos permanecem em `src/shared/mocks/products.ts` como fallback de desenvolvimento.
- As imagens atuais usam URLs externas para fins de demonstração.
- Para produção, recomenda-se substituir por fotos reais otimizadas da Cesta.com.
