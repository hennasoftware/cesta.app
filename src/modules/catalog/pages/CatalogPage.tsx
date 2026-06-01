import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownAZ, Gift, SearchX, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../../shared/components/cards/ProductCard';
import { SearchBar } from '../../../shared/components/SearchBar';
import { Seo } from '../../../shared/components/Seo';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { WhatsAppButton } from '../../../shared/components/WhatsAppButton';
import { Loading } from '../../../shared/components/ui/Loading';
import { Select, type SelectOption } from '../../../shared/components/ui/Select';
import { SectionTitle } from '../../../shared/components/ui/SectionTitle';
import { useProducts } from '../../../shared/hooks/useProducts';
import { categories } from '../../../shared/mocks/products';
import type { ProductCategory } from '../../../shared/types/product';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

const categoryOptions: Array<SelectOption<ProductCategory | 'todos'>> = [
  { value: 'todos', label: 'Todos' },
  ...categories.map((categoryItem) => ({ value: categoryItem.id, label: categoryItem.name })),
];
const sortOptions: Array<SelectOption<SortOption>> = [
  { value: 'featured', label: 'Destaques' },
  { value: 'price-desc', label: 'Maior preco' },
  { value: 'price-asc', label: 'Menor preco' },
  { value: 'name', label: 'Nome' },
];
const validCategoryIds = new Set(categories.map((category) => category.id));

function getValidInitialCategory(value: string | null) {
  return value && validCategoryIds.has(value as ProductCategory) ? (value as ProductCategory) : 'todos';
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = getValidInitialCategory(searchParams.get('categoria'));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'todos'>(initialCategory);
  const [sort, setSort] = useState<SortOption>('name');
  const { products, loading, error } = useProducts({ fallbackToMocks: false });

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === 'todos' || product.category === category;
      const matchesSearch = [product.name, product.description, product.tag]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return Number(b.featured) - Number(a.featured);
    });
  }, [category, products, query, sort]);

  function changeCategory(value: ProductCategory | 'todos') {
    setCategory(value);
    if (value === 'todos') {
      setSearchParams({});
      return;
    }
    setSearchParams({ categoria: value });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo title="Catalogo de cestas | Cesta.com" description="Veja cestas, kits afetivos e presentes personalizados para pedir pelo WhatsApp." />
      <div className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white shadow-premium backdrop-blur dark:border-white/14 dark:bg-[#24150f]">
        <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-[1fr_0.45fr] lg:items-end">
          <div className="space-y-8">
            <Badge tone="rose">Catálogo virtual</Badge>
            <SectionTitle
              title="Escolha a cesta ideal para emocionar"
              description="Busque, filtre e ordene presentes premium com compra rápida pelo WhatsApp."
            />
          </div>
          <div className="rounded-[2rem] bg-espresso p-5 text-cream shadow-glow dark:bg-[#352117]">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold text-espresso">
                <Gift size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-gold">Datas comemorativas</p>
                <p className="text-lg font-extrabold">Monte um pedido sob medida.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-coffee/8 bg-cream/75 p-5 dark:border-white/14 dark:bg-[#1f130e] lg:grid-cols-[1fr_auto_auto]">
          <SearchBar value={query} onChange={setQuery} />
          <Select
            value={category}
            options={categoryOptions}
            onChange={changeCategory}
            ariaLabel="Filtrar por categoria"
            icon={<SlidersHorizontal size={17} />}
            className="bg-white/90"
          />
          <Select
            value={sort}
            options={sortOptions}
            onChange={setSort}
            ariaLabel="Ordenar produtos"
            icon={<ArrowDownAZ size={17} />}
            className="bg-white/90"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-semibold text-coffee/72 dark:text-cream/78">{filteredProducts.length} produto(s) encontrados</p>
        <Badge tone="coffee">Carrinho visual: 0 itens</Badge>
      </div>

      {error && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-gold/20 px-4 py-4 text-sm font-bold text-coffee sm:flex-row sm:items-center sm:justify-between">
          <span>Nao foi possivel carregar os produtos do Firestore: {error}</span>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
            <WhatsAppButton message="Ola, Cesta.com. Nao consegui carregar o catalogo e preciso de ajuda para fazer um pedido." size="sm">
              Pedir ajuda
            </WhatsAppButton>
          </div>
        </div>
      )}

      {loading ? (
        <Loading label="Carregando catalogo..." variant="catalog" />
      ) : filteredProducts.length > 0 ? (
        <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-8 rounded-[2.5rem] border border-coffee/8 bg-white p-10 text-center shadow-sm dark:border-white/14 dark:bg-[#24150f]">
          <SearchX className="mx-auto text-caramel" size={36} />
          <h2 className="mt-4 text-2xl font-extrabold text-coffee dark:text-cream">Nenhum presente encontrado</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-coffee/72 dark:text-cream/78">
            Ajuste a busca ou fale pelo WhatsApp para criar uma cesta personalizada para essa ocasião.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-pistachio px-4 py-2 text-sm font-bold text-coffee">
            <Sparkles size={16} /> Atendimento monta uma sugestão para você
          </div>
        </div>
      )}
    </motion.div>
  );
}
