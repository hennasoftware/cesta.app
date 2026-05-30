import { EmptyState } from '../../../shared/components/ui/EmptyState';
import type { Product } from '../../../shared/types/product';
import { ProductCard } from './ProductCard';

type ProductListProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (!products.length) {
    return <EmptyState title="Nenhum produto cadastrado" description="Cadastre a primeira cesta para ela aparecer no catalogo publico." />;
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
