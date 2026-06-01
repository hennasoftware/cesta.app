import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import { Select, type SelectOption } from '../../../shared/components/ui/Select';
import type { Product } from '../../../shared/types/product';
import { ProductCard } from './ProductCard';

type ProductListProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

type StatusFilter = 'todos' | 'ativos' | 'inativos';
type SortFilter = 'recentes' | 'nome' | 'preco';

const statusOptions: Array<SelectOption<StatusFilter>> = [
  { value: 'todos', label: 'Todos' },
  { value: 'ativos', label: 'Disponiveis' },
  { value: 'inativos', label: 'Indisponiveis' },
];

const sortOptions: Array<SelectOption<SortFilter>> = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'nome', label: 'Nome' },
  { value: 'preco', label: 'Maior preco' },
];

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('todos');
  const [sort, setSort] = useState<SortFilter>('recentes');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products
      .filter((product) => {
        const matchesSearch = [product.name, product.description, product.tag].join(' ').toLowerCase().includes(normalizedQuery);
        const matchesStatus =
          status === 'todos' ||
          (status === 'ativos' && product.available !== false) ||
          (status === 'inativos' && product.available === false);
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sort === 'nome') return a.name.localeCompare(b.name);
        if (sort === 'preco') return b.price - a.price;
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      });
  }, [products, query, sort, status]);

  if (!products.length) {
    return <EmptyState title="Nenhum produto cadastrado" description="Cadastre a primeira cesta para ela aparecer no catalogo publico." />;
  }

  return (
    <>
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <label className="flex h-11 items-center gap-2 rounded-full border border-coffee/10 bg-white px-4 text-sm text-coffee shadow-sm dark:border-white/15 dark:bg-cream dark:text-espresso">
          <Search size={16} className="text-caramel" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-coffee/50" placeholder="Buscar produto" />
        </label>
        <Select value={status} options={statusOptions} onChange={setStatus} ariaLabel="Filtrar por disponibilidade" icon={<SlidersHorizontal size={16} />} className="h-11 bg-white/90" />
        <Select value={sort} options={sortOptions} onChange={setSort} ariaLabel="Ordenar produtos do admin" className="h-11 bg-white/90" />
      </div>
      {filteredProducts.length ? (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhum produto encontrado" description="Ajuste busca, disponibilidade ou ordenacao para encontrar o produto." />
      )}
    </>
  );
}
