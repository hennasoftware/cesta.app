import { LogOut, Package, Plus, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Seo } from '../../../shared/components/Seo';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { Loading } from '../../../shared/components/ui/Loading';
import { logoutAdmin } from '../../../shared/services/auth';
import { deleteProduct } from '../../../shared/services/products';
import type { Product } from '../../../shared/types/product';
import { useProducts } from '../../../shared/hooks/useProducts';
import { ProductForm } from '../components/ProductForm';
import { ProductList } from '../components/ProductList';
import { useAuth } from '../context/AuthContext';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { products, loading, error } = useProducts({ includeUnavailable: true, fallbackToMocks: false });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  async function confirmDelete() {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      setMessage('Produto excluido com sucesso.');
      setDeleteError('');
      if (editingProduct?.id === deletingProduct.id) setEditingProduct(null);
      setDeletingProduct(null);
    } catch (deleteProductError) {
      setDeleteError(deleteProductError instanceof Error ? deleteProductError.message : 'Nao foi possivel excluir o produto.');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSaved(successMessage: string) {
    setEditingProduct(null);
    setMessage(successMessage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo title="Gerenciar produtos | Cesta.com" description="Painel administrativo para gerenciar produtos do catalogo." />
      <ConfirmDialog
        open={Boolean(deletingProduct)}
        title="Excluir produto?"
        description={`Esta acao remove "${deletingProduct?.name ?? 'este produto'}" do catalogo e nao pode ser desfeita.`}
        confirmLabel="Excluir"
        tone="danger"
        loading={isDeleting}
        onCancel={() => (isDeleting ? undefined : setDeletingProduct(null))}
        onConfirm={confirmDelete}
      />
      <section className="rounded-[2rem] border border-white/70 bg-espresso p-6 text-cream shadow-premium dark:border-white/14 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-gold">
              <ShieldCheck size={18} /> Area administrativa
            </div>
            <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Gerenciar produtos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cream/78">Cadastre, edite e remova os produtos exibidos no catalogo publico da Cesta.com.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">{user?.email}</span>
            <Button type="button" variant="secondary" onClick={logoutAdmin}>
              <LogOut size={17} /> Sair
            </Button>
          </div>
        </div>
      </section>

      {message && <p className="mt-6 rounded-2xl bg-pistachio px-4 py-3 text-sm font-bold text-coffee">{message}</p>}
      {(error || deleteError) && <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error || deleteError}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div ref={formRef} className="scroll-mt-6">
          <ProductForm product={editingProduct} onCancelEdit={() => setEditingProduct(null)} onSaved={handleSaved} />
        </div>

        <section className="rounded-[2rem] border border-white/70 bg-cream/80 p-5 shadow-sm dark:border-white/14 dark:bg-[#1f130e] md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-caramel">
                <Package size={18} /> Produtos
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-coffee dark:text-cream">{products.length} cadastrado(s)</h2>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingProduct(null)}>
              <Plus size={17} /> Novo
            </Button>
          </div>

          {loading ? <Loading label="Carregando produtos..." variant="adminList" /> : <ProductList products={products} onEdit={handleEdit} onDelete={setDeletingProduct} />}
        </section>
      </div>
    </div>
  );
}
