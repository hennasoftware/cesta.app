import { motion } from 'framer-motion';
import { ArrowDownAZ, ChevronLeft, ChevronRight, Gift, MoreHorizontal, SearchX } from 'lucide-react';
import { useDeferredValue, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../../shared/components/cards/ProductCard';
import { SearchBar } from '../../../shared/components/SearchBar';
import { Seo } from '../../../shared/components/Seo';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { WhatsAppButton } from '../../../shared/components/WhatsAppButton';
import { CatalogSkeleton } from '../../../shared/components/ui/Skeletons';
import { Select, type SelectOption } from '../../../shared/components/ui/Select';
import { SectionTitle } from '../../../shared/components/ui/SectionTitle';
import {
  giftSubcategories,
  getCategoryName,
  getSubcategoryName,
  isProductSubcategory,
  normalizeCategoryFilter,
  normalizeProductClassification,
  productCategories,
} from '../../../shared/config/categories';
import { useCatalogProducts } from '../../../shared/hooks/useProducts';
import type { CatalogSort } from '../../../shared/services/products';
import { catalogSuggestionMessage } from '../../../shared/services/whatsapp';
import type { ProductCategory, ProductSubcategory } from '../../../shared/types/product';

type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

const PRODUCTS_PER_PAGE = 6;

const sortOptions: Array<SelectOption<CatalogSort>> = [
  { value: 'featured', label: 'Destaques' },
  { value: 'price-desc', label: 'Maior preco' },
  { value: 'price-asc', label: 'Menor preco' },
  { value: 'name', label: 'Nome' },
];

const sortParamByValue: Record<CatalogSort, string> = {
  featured: 'destaques',
  'price-desc': 'preco-desc',
  'price-asc': 'preco-asc',
  name: 'nome',
};

const sortValueByParam: Record<string, CatalogSort> = {
  destaques: 'featured',
  featured: 'featured',
  'preco-desc': 'price-desc',
  'price-desc': 'price-desc',
  'preco-asc': 'price-asc',
  'price-asc': 'price-asc',
  nome: 'name',
  name: 'name',
};

function getSortFromParam(value: string | null): CatalogSort {
  return value ? sortValueByParam[value] ?? 'name' : 'name';
}

function getPageFromParam(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
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
  const searchParamsKey = searchParams.toString();
  const query = searchParams.get('busca') ?? '';
  const deferredQuery = useDeferredValue(query);
  const sort = getSortFromParam(searchParams.get('ordem'));
  const currentPage = getPageFromParam(searchParams.get('page'));
  const requestedCategory = searchParams.get('categoria');
  const category = normalizeCategoryFilter(requestedCategory) ?? 'todos';
  const subcategoryParam = searchParams.get('subcategoria');
  const subcategory: ProductSubcategory | 'todas' =
    category === 'presentes' && isProductSubcategory(subcategoryParam) ? subcategoryParam : 'todas';
  const { products: paginatedProducts, totalProducts, loading, error } = useCatalogProducts({
    category,
    subcategory,
    sort,
    page: currentPage,
    pageSize: PRODUCTS_PER_PAGE,
    search: deferredQuery,
  });

  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const firstProductIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleStart = totalProducts ? firstProductIndex + 1 : 0;
  const visibleEnd = Math.min(firstProductIndex + paginatedProducts.length, totalProducts);
  const paginationItems = useMemo(() => getPaginationItems(currentPage, totalPages), [currentPage, totalPages]);
  const mobilePaginationItems = useMemo(() => getMobilePaginationItems(currentPage, totalPages), [currentPage, totalPages]);
  const suggestionMessage = catalogSuggestionMessage({
    search: query || undefined,
    category: category !== 'todos' ? getCategoryName(category, true) : undefined,
    subcategory: subcategory !== 'todas' ? getSubcategoryName(subcategory) ?? undefined : undefined,
  });

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParamsKey);
    const rawCategory = nextParams.get('categoria');
    const normalizedCategory = normalizeCategoryFilter(rawCategory);
    let changed = false;

    if (rawCategory && !normalizedCategory) {
      nextParams.delete('categoria');
      nextParams.delete('subcategoria');
      changed = true;
    } else if (rawCategory && normalizedCategory && rawCategory !== normalizedCategory) {
      const legacyClassification = normalizeProductClassification(rawCategory);
      nextParams.set('categoria', normalizedCategory);
      if (!nextParams.has('subcategoria') && legacyClassification.subcategory) {
        nextParams.set('subcategoria', legacyClassification.subcategory);
      }
      changed = true;
    }

    const canonicalCategory = normalizeCategoryFilter(nextParams.get('categoria'));
    const rawSubcategory = nextParams.get('subcategoria');
    if (rawSubcategory && (canonicalCategory !== 'presentes' || !isProductSubcategory(rawSubcategory))) {
      nextParams.delete('subcategoria');
      changed = true;
    }

    const rawSearch = nextParams.get('busca');
    if (rawSearch !== null && !rawSearch.trim()) {
      nextParams.delete('busca');
      changed = true;
    }

    const rawSort = nextParams.get('ordem');
    const normalizedSort = getSortFromParam(rawSort);
    if (rawSort && !sortValueByParam[rawSort]) {
      nextParams.delete('ordem');
      changed = true;
    } else if (rawSort && normalizedSort === 'name') {
      nextParams.delete('ordem');
      changed = true;
    } else if (rawSort && rawSort !== sortParamByValue[normalizedSort]) {
      nextParams.set('ordem', sortParamByValue[normalizedSort]);
      changed = true;
    }

    const rawPage = nextParams.get('page');
    const normalizedPage = getPageFromParam(rawPage);
    if (rawPage && (normalizedPage === 1 || rawPage !== String(normalizedPage))) {
      nextParams.delete('page');
      changed = true;
    }

    if (changed) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParamsKey, setSearchParams]);

  useEffect(() => {
    if (loading || currentPage <= totalPages) return;
    const nextParams = new URLSearchParams(searchParams);
    if (totalPages > 1) {
      nextParams.set('page', String(totalPages));
    } else {
      nextParams.delete('page');
    }
    setSearchParams(nextParams, { replace: true });
  }, [currentPage, loading, searchParams, setSearchParams, totalPages]);

  function changeCategory(value: ProductCategory | 'todos') {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('page');
    if (value === 'todos') {
      nextParams.delete('categoria');
      nextParams.delete('subcategoria');
      setSearchParams(nextParams);
      return;
    }
    nextParams.set('categoria', value);
    nextParams.delete('subcategoria');
    setSearchParams(nextParams);
  }

  function changeSubcategory(value: ProductSubcategory | 'todas') {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('page');
    nextParams.set('categoria', 'presentes');
    if (value === 'todas') {
      nextParams.delete('subcategoria');
    } else {
      nextParams.set('subcategoria', value);
    }
    setSearchParams(nextParams);
  }

  function changePage(page: number) {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    const nextParams = new URLSearchParams(searchParams);
    if (nextPage === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(nextPage));
    }
    setSearchParams(nextParams);
    document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clearFilters() {
    setSearchParams({});
    document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-12 lg:px-8">
      <Seo title="Catalogo de cestas | Cesta.com" description="Veja cestas, kits afetivos e presentes personalizados para pedir pelo WhatsApp." />
      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-premium backdrop-blur dark:border-white/14 dark:bg-[#24150f] sm:rounded-[2.5rem]">
        <div className="hidden gap-6 p-6 md:grid md:p-10 lg:grid-cols-[1fr_0.45fr] lg:items-end">
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

        <div className="grid gap-3 bg-cream/75 p-4 dark:bg-[#1f130e] sm:gap-4 sm:p-5 md:border-t md:border-coffee/8 md:dark:border-white/14 lg:grid-cols-[1fr_auto]">
          <SearchBar
            value={query}
            onChange={(value) => {
              const nextParams = new URLSearchParams(searchParams);
              if (value) {
                nextParams.set('busca', value);
              } else {
                nextParams.delete('busca');
              }
              nextParams.delete('page');
              setSearchParams(nextParams, { replace: true });
            }}
          />
          <Select
            value={sort}
            options={sortOptions}
            onChange={(value) => {
              const nextParams = new URLSearchParams(searchParams);
              if (value === 'name') {
                nextParams.delete('ordem');
              } else {
                nextParams.set('ordem', sortParamByValue[value]);
              }
              nextParams.delete('page');
              setSearchParams(nextParams);
            }}
            ariaLabel="Ordenar produtos"
            icon={<ArrowDownAZ size={17} />}
            className="bg-white/90"
          />

          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0 lg:col-span-2" aria-label="Filtros rápidos por categoria">
            <button
              type="button"
              onClick={() => changeCategory('todos')}
              aria-pressed={category === 'todos'}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-extrabold transition ${
                category === 'todos'
                  ? 'border-coffee bg-coffee text-cream shadow-sm dark:border-gold dark:bg-gold dark:text-espresso'
                  : 'border-coffee/10 bg-white text-coffee/70 hover:border-caramel/40 hover:text-coffee dark:border-white/14 dark:bg-[#2a1a13] dark:text-cream/75'
              }`}
            >
              Todas
            </button>
            {productCategories.map((categoryItem) => (
              <button
                key={categoryItem.id}
                type="button"
                onClick={() => changeCategory(categoryItem.id)}
                aria-pressed={category === categoryItem.id}
                className={`h-10 shrink-0 rounded-full border px-4 text-sm font-extrabold transition ${
                  category === categoryItem.id
                    ? 'border-coffee bg-coffee text-cream shadow-sm dark:border-gold dark:bg-gold dark:text-espresso'
                    : 'border-coffee/10 bg-white text-coffee/70 hover:border-caramel/40 hover:text-coffee dark:border-white/14 dark:bg-[#2a1a13] dark:text-cream/75'
                }`}
              >
                {categoryItem.shortName}
              </button>
            ))}
          </div>

          {category === 'presentes' && (
            <div className="flex flex-nowrap gap-2 overflow-x-auto border-t border-coffee/8 pt-3 dark:border-white/10 sm:flex-wrap sm:overflow-visible sm:pt-4 lg:col-span-2" aria-label="Filtros por subcategoria">
              <button
                type="button"
                onClick={() => changeSubcategory('todas')}
                aria-pressed={subcategory === 'todas'}
                className={`h-9 shrink-0 rounded-full px-3.5 text-xs font-extrabold transition ${
                  subcategory === 'todas'
                    ? 'bg-caramel text-white shadow-sm'
                    : 'bg-white text-coffee/68 ring-1 ring-coffee/10 hover:text-coffee dark:bg-[#2a1a13] dark:text-cream/72 dark:ring-white/14'
                }`}
              >
                Todas
              </button>
              {giftSubcategories.map((subcategoryItem) => (
                <button
                  key={subcategoryItem.id}
                  type="button"
                  onClick={() => changeSubcategory(subcategoryItem.id)}
                  aria-pressed={subcategory === subcategoryItem.id}
                  className={`h-9 shrink-0 rounded-full px-3.5 text-xs font-extrabold transition ${
                    subcategory === subcategoryItem.id
                      ? 'bg-caramel text-white shadow-sm'
                      : 'bg-white text-coffee/68 ring-1 ring-coffee/10 hover:text-coffee dark:bg-[#2a1a13] dark:text-cream/72 dark:ring-white/14'
                  }`}
                >
                  {subcategoryItem.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div id="catalog-results" className="mt-5 sm:mt-8">
        <p className="text-sm font-semibold text-coffee/72 dark:text-cream/78">
          {totalProducts} produto(s) encontrados
          {totalProducts > 0 && (
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
        <CatalogSkeleton />
      ) : totalProducts > 0 ? (
        <>
          <div className="mt-3 grid items-stretch gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                catalogReturnUrl={`/catalogo${searchParamsKey ? `?${searchParamsKey}` : ''}`}
              />
            ))}
          </div>

          <nav className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-coffee/10 bg-white/85 p-3 shadow-[0_18px_50px_rgba(74,33,23,0.08)] backdrop-blur dark:border-white/14 dark:bg-[#24150f]/90 sm:flex-row sm:items-center sm:justify-between sm:px-4" aria-label="Paginacao do catalogo">
            <div className="flex items-center justify-between gap-3 sm:block">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-caramel dark:text-gold">Pagina {currentPage} de {totalPages}</p>
              <p className="text-sm font-semibold text-coffee/68 dark:text-cream/72">
                {visibleStart}-{visibleEnd} de {totalProducts} produtos
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
        <div className="mt-8 rounded-[2.5rem] border border-coffee/8 bg-white px-5 py-10 text-center shadow-sm dark:border-white/14 dark:bg-[#24150f] sm:px-10 sm:py-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-pistachio text-caramel dark:bg-[#123b39] dark:text-[#64e3dd]">
            <SearchX size={30} />
          </span>
          <h2 className="mt-5 text-2xl font-extrabold text-coffee dark:text-cream">Nenhuma cesta encontrada</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-coffee/72 dark:text-cream/78">
            Não encontramos produtos para os filtros selecionados.
          </p>
          <div className="mx-auto mt-7 grid max-w-lg gap-3 sm:grid-cols-2">
            <Button type="button" variant="secondary" size="lg" className="w-full" onClick={clearFilters}>
              Limpar filtros
            </Button>
            <WhatsAppButton
              message={suggestionMessage}
              size="lg"
              className="w-full bg-[#1f8f4d] font-extrabold text-white shadow-[0_12px_28px_rgba(31,143,77,0.24)] hover:bg-[#187a40] dark:bg-[#25d366] dark:text-espresso dark:hover:bg-[#31df73]"
            >
              Pedir uma sugestão
            </WhatsAppButton>
          </div>
        </div>
      )}
    </motion.div>
  );
}
