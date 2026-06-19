import { Package, Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Seo } from '../../../shared/components/Seo';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { AdminProductListSkeleton } from '../../../shared/components/ui/Skeletons';
import { logoutAdmin } from '../../../shared/services/auth';
import { deleteProduct, updateProductAvailability } from '../../../shared/services/products';
import type { Product } from '../../../shared/types/product';
import { useAdminProducts } from '../../../shared/hooks/useProducts';
import { ProductForm } from '../components/ProductForm';
import { ProductList } from '../components/ProductList';
import { AdminCategoriesPanel } from '../components/AdminCategoriesPanel';
import { AdminLayout, type AdminView } from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, loading, error } = useAdminProducts();
  const [activeView, setActiveView] = useState<AdminView>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const pendingActionRef = useRef<null | (() => void)>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const requestAction = useCallback((action: () => void) => {
    if (!isFormDirty) {
      action();
      return;
    }

    pendingActionRef.current = action;
    setShowDiscardDialog(true);
  }, [isFormDirty]);

  useEffect(() => {
    if (!isFormDirty) return undefined;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    function handleDocumentClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.dataset.unsavedGuard === 'ignore') return;

      const url = new URL(anchor.href, window.location.href);
      const isSamePage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash === window.location.hash;
      if (isSamePage) return;

      event.preventDefault();
      event.stopPropagation();
      requestAction(() => {
        if (url.origin === window.location.origin) {
          navigate(`${url.pathname}${url.search}${url.hash}`);
          document.body.style.overflow = '';
        } else if (anchor.target === '_blank') {
          window.open(url.toString(), '_blank', 'noopener,noreferrer');
        } else {
          window.location.assign(url.toString());
        }
      });
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isFormDirty, navigate, requestAction]);

  function discardChanges() {
    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    setShowDiscardDialog(false);
    setIsFormDirty(false);
    setFormVersion((version) => version + 1);
    pendingAction?.();
  }

  function keepEditing() {
    pendingActionRef.current = null;
    setShowDiscardDialog(false);
  }

  async function confirmDelete() {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      setMessage('Produto excluido com sucesso.');
      setDeleteError('');
      if (editingProduct?.id === deletingProduct.id) {
        setEditingProduct(null);
        setActiveView('products');
      }
      setDeletingProduct(null);
    } catch (deleteProductError) {
      setDeleteError(deleteProductError instanceof Error ? deleteProductError.message : 'Nao foi possivel excluir o produto.');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSaved(successMessage: string) {
    setEditingProduct(null);
    setActiveView('products');
    setIsFormDirty(false);
    setFormVersion((version) => version + 1);
    setMessage(successMessage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleEdit(product: Product) {
    requestAction(() => {
      setEditingProduct(product);
      setActiveView('form');
      window.setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    });
  }

  function handleNewProduct() {
    requestAction(() => {
      setEditingProduct(null);
      setActiveView('form');
      window.setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    });
  }

  function handleCancelEdit() {
    requestAction(() => {
      setEditingProduct(null);
      setActiveView('products');
    });
  }

  function handleProductsView() {
    requestAction(() => {
      setActiveView('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function handleCategoriesView() {
    requestAction(() => {
      setActiveView('categories');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function handleDeleteRequest(product: Product) {
    if (editingProduct?.id === product.id) {
      requestAction(() => setDeletingProduct(product));
      return;
    }
    setDeletingProduct(product);
  }

  async function handleAvailabilityChange(product: Product, available: boolean) {
    setUpdatingProductId(product.id);
    setDeleteError('');
    setMessage('');

    try {
      await updateProductAvailability(product.id, available);
      setMessage(
        available
          ? `"${product.name}" voltou a aparecer no catálogo.`
          : `"${product.name}" foi retirado do catálogo.`,
      );
    } catch (availabilityError) {
      setDeleteError(
        availabilityError instanceof Error
          ? availabilityError.message
          : 'Nao foi possivel atualizar a disponibilidade do produto.',
      );
    } finally {
      setUpdatingProductId(null);
    }
  }

  return (
    <AdminLayout
      activeView={activeView}
      userEmail={user?.email}
      onProducts={handleProductsView}
      onNewProduct={handleNewProduct}
      onCategories={handleCategoriesView}
      onLogout={() => requestAction(() => void logoutAdmin())}
    >
      <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
      <ConfirmDialog
        open={showDiscardDialog}
        title="Descartar alterações?"
        description="As informações preenchidas ainda não foram salvas. Se continuar, essas alterações serão perdidas."
        confirmLabel="Descartar alterações"
        cancelLabel="Continuar editando"
        tone="danger"
        onCancel={keepEditing}
        onConfirm={discardChanges}
      />
      {message && <p className="mt-6 rounded-2xl bg-pistachio px-4 py-3 text-sm font-bold text-coffee">{message}</p>}
      {(error || deleteError) && <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error || deleteError}</p>}

      {activeView === 'categories' ? (
        <div className="mt-6">
          <AdminCategoriesPanel products={products} />
        </div>
      ) : (
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div ref={formRef} className={`scroll-mt-36 ${activeView === 'form' ? 'block' : 'hidden'} lg:block`}>
          <ProductForm
            key={`${editingProduct?.id ?? 'new'}-${formVersion}`}
            product={editingProduct}
            onCancelEdit={handleCancelEdit}
            onSaved={handleSaved}
            onDirtyChange={setIsFormDirty}
          />
        </div>

        <section className={`${activeView === 'products' ? 'block' : 'hidden'} rounded-[2rem] border border-white/70 bg-cream/80 p-5 shadow-sm dark:border-white/14 dark:bg-[#1f130e] md:p-6 lg:block`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-caramel">
                <Package size={18} /> Produtos
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-coffee dark:text-cream">{products.length} cadastrado(s)</h2>
            </div>
          </div>

          {loading ? (
            <AdminProductListSkeleton />
          ) : (
            <ProductList
              products={products}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onAvailabilityChange={handleAvailabilityChange}
              updatingProductId={updatingProductId}
            />
          )}
        </section>
      </div>
      )}

      {activeView === 'products' && (
        <button
          type="button"
          onClick={handleNewProduct}
          className="fixed bottom-5 right-4 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-coffee px-5 text-sm font-extrabold text-cream shadow-[0_18px_45px_rgba(74,33,23,0.30)] ring-1 ring-white/40 transition hover:bg-espresso focus:outline-none focus:ring-2 focus:ring-gold/60 dark:bg-gold dark:text-espresso lg:hidden"
          aria-label="Cadastrar nova cesta"
        >
          <Plus size={20} /> Nova cesta
        </button>
      )}
      </div>
    </AdminLayout>
  );
}
