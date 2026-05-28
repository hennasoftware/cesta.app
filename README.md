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

## Observações

- Os produtos e categorias estão mockados em `src/shared/mocks/products.ts`.
- As imagens atuais usam URLs externas para fins de demonstração.
- Para produção, recomenda-se substituir por fotos reais otimizadas da Cesta.com.
