import { FolderTree } from 'lucide-react';
import { productCategories } from '../../../shared/config/categories';
import type { Product } from '../../../shared/types/product';

export function AdminCategoriesPanel({ products }: { products: Product[] }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-sm dark:border-white/14 dark:bg-[#24150f] md:p-6">
      <div>
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-caramel">
          <FolderTree size={18} /> Categorias
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-coffee dark:text-cream">Organização do catálogo</h1>
        <p className="mt-2 text-sm leading-6 text-coffee/65 dark:text-cream/65">
          Visão rápida das categorias utilizadas no cadastro das cestas.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {productCategories.map((category) => {
          const categoryProducts = products.filter((product) => product.category === category.id);
          return (
            <article key={category.id} className="rounded-[1.5rem] border border-coffee/8 bg-cream/55 p-4 dark:border-white/10 dark:bg-[#1f130e]">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-extrabold text-coffee dark:text-cream">{category.name}</h2>
                <span className="shrink-0 rounded-full bg-caramel/12 px-2.5 py-1 text-xs font-extrabold text-caramel">
                  {categoryProducts.length}
                </span>
              </div>
              {category.subcategories?.length ? (
                <ul className="mt-4 grid gap-2">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.id} className="flex items-center justify-between gap-3 text-sm font-semibold text-coffee/65 dark:text-cream/65">
                      <span>{subcategory.name}</span>
                      <span>{categoryProducts.filter((product) => product.subcategory === subcategory.id).length}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm font-semibold text-coffee/55 dark:text-cream/55">Sem subcategorias.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
