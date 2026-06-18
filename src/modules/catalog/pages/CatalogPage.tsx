import { motion } from 'framer-motion';
import { ArrowDownAZ, ChevronLeft, ChevronRight, Gift, MoreHorizontal, SearchX, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

const PRODUCTS_PER_PAGE = 6;

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

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

  if (currentPage <= 3) return [1, 2, 3, 4, 'ellipsis-end', totalPages];
  if (currentPage >= totalPages - 2) return [1, 'ellipsis-start', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

  return [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];
}

function getMobilePaginationItems(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 3) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];

  return [currentPage - 1, currentPage, currentPage + 1];
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = getValidInitialCategory(searchParams.get('categoria'));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'todos'>(initialCategory);
  const [sort, setSort] = useState<SortOption>('name');
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const firstProductIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(firstProductIndex, firstProductIndex + PRODUCTS_PER_PAGE);
  const visibleStart = filteredProducts.length ? firstProductIndex + 1 : 0;
  const visibleEnd = Math.min(firstProductIndex + PRODUCTS_PER_PAGE, filteredProducts.length);
  const paginationItems = useMemo(() => getPaginationItems(currentPage, totalPages), [currentPage, totalPages]);
  const mobilePaginationItems = useMemo(() => getMobilePaginationItems(currentPage, totalPages), [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, query, sort]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  function changeCategory(value: ProductCategory | 'todos') {
    setCategory(value);
    if (value === 'todos') {
      setSearchParams({});
      return;
    }
    setSearchParams({ categoria: value });
  }

  function changePage(page: number) {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      <div id="catalog-results" className="mt-8">
        <p className="text-sm font-semibold text-coffee/72 dark:text-cream/78">
          {filteredProducts.length} produto(s) encontrados
          {filteredProducts.length > 0 && (
            <span className="ml-2 text-coffee/55 dark:text-cream/60">
              Exibindo {visibleStart}-{visibleEnd}
            </span>
          )}
        </p>
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
        <>
          <div className="mt-5 grid items-stretch gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <nav className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-coffee/10 bg-white/85 p-3 shadow-[0_18px_50px_rgba(74,33,23,0.08)] backdrop-blur dark:border-white/14 dark:bg-[#24150f]/90 sm:flex-row sm:items-center sm:justify-between sm:px-4" aria-label="Paginacao do catalogo">
            <div className="flex items-center justify-between gap-3 sm:block">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-caramel dark:text-gold">Pagina {currentPage} de {totalPages}</p>
              <p className="text-sm font-semibold text-coffee/68 dark:text-cream/72">
                {visibleStart}-{visibleEnd} de {filteredProducts.length} produtos
              </p>
            </div>

            <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2 sm:flex sm:justify-end">
              <button
                type="button"
                aria-label="Pagina anterior"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="grid h-11 w-11 place-items-center rounded-full border border-coffee/10 bg-cream text-coffee transition hover:border-gold/60 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/14 dark:bg-[#1f130e] dark:text-cream dark:hover:bg-white/10"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex min-w-0 items-center justify-center">
                <div className="flex items-center gap-1 rounded-full bg-cream p-1 dark:bg-[#1f130e] sm:hidden">
                  {mobilePaginationItems.map((page) => (
                    <button
                      key={page}
                      type="button"
                      aria-label={`Ir para pagina ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                      onClick={() => changePage(page)}
                      className={`grid h-9 min-w-9 place-items-center rounded-full px-2 text-sm font-extrabold transition ${
                        page === currentPage
                          ? 'bg-coffee text-cream shadow-[0_8px_18px_rgba(74,33,23,0.20)] dark:bg-gold dark:text-espresso'
                          : 'text-coffee/65 hover:bg-white hover:text-coffee dark:text-cream/70 dark:hover:bg-white/10 dark:hover:text-cream'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <div className="hidden items-center gap-1 rounded-full bg-cream p-1 dark:bg-[#1f130e] sm:flex">
                  {paginationItems.map((item) =>
                    typeof item === 'number' ? (
                      <button
                        key={item}
                        type="button"
                        aria-label={`Ir para pagina ${item}`}
                        aria-current={item === currentPage ? 'page' : undefined}
                        onClick={() => changePage(item)}
                        className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-extrabold transition ${
                          item === currentPage
                            ? 'bg-coffee text-cream shadow-[0_10px_24px_rgba(74,33,23,0.20)] dark:bg-gold dark:text-espresso'
                            : 'text-coffee/70 hover:bg-white hover:text-coffee dark:text-cream/70 dark:hover:bg-white/10 dark:hover:text-cream'
                        }`}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={item} className="grid h-10 min-w-9 place-items-center text-coffee/38 dark:text-cream/40">
                        <MoreHorizontal size={17} />
                      </span>
                    ),
                  )}
                </div>
              </div>

              <button
                type="button"
                aria-label="Proxima pagina"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="grid h-11 w-11 place-items-center rounded-full bg-coffee text-cream shadow-[0_12px_26px_rgba(74,33,23,0.22)] transition hover:bg-espresso disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gold dark:text-espresso dark:hover:bg-cream"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </nav>
        </>
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
