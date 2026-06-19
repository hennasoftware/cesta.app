import { CheckCircle2, Edit3, Images, Loader2, Star, Trash2, XCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { getCategoryName, getSubcategoryName } from '../../../shared/config/categories';
import { formatCurrency } from '../../../shared/services/whatsapp';
import type { Product } from '../../../shared/types/product';

type ProductCardProps = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAvailabilityChange: (product: Product, available: boolean) => void;
  updatingAvailability: boolean;
};

function formatDate(value?: Date) {
  if (!value) return 'Sem data';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(value);
}

export function ProductCard({ product, onEdit, onDelete, onAvailabilityChange, updatingAvailability }: ProductCardProps) {
  const images = product.images.length ? product.images : product.photo ? [product.photo] : [];
  const isAvailable = product.available !== false;

  return (
    <article className="grid gap-4 rounded-[2rem] border border-coffee/8 bg-white p-4 shadow-sm dark:border-white/14 dark:bg-[#24150f] sm:grid-cols-[9rem_1fr]">
      <div>
        <img src={product.photo || images[0]} alt={product.name} className="h-36 w-full rounded-[1.5rem] object-cover sm:h-32" loading="lazy" decoding="async" />
        {images.length > 1 && (
          <div className="mt-2 grid grid-cols-3 gap-1">
            {images.slice(1, 4).map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="" className="h-10 w-full rounded-lg object-cover" loading="lazy" decoding="async" />
            ))}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-coffee dark:text-cream">{product.name}</h3>
            <p className="mt-1 text-sm font-bold text-caramel">{formatCurrency(product.price)}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isAvailable}
            aria-label={`${isAvailable ? 'Retirar' : 'Disponibilizar'} ${product.name} no catálogo`}
            disabled={updatingAvailability}
            onClick={() => onAvailabilityChange(product, !isAvailable)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-extrabold transition disabled:cursor-wait disabled:opacity-70 ${
              isAvailable
                ? 'border-pistachio bg-pistachio text-coffee'
                : 'border-red-200 bg-red-100 text-red-700'
            }`}
          >
            {updatingAvailability ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isAvailable ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            <span>{isAvailable ? 'Disponível' : 'Indisponível'}</span>
            <span
              aria-hidden="true"
              className={`relative h-5 w-9 rounded-full transition ${
                isAvailable ? 'bg-sage' : 'bg-red-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                  isAvailable ? 'left-[1.125rem]' : 'left-0.5'
                }`}
              />
            </span>
          </button>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-coffee/72 dark:text-cream/78">{product.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-extrabold text-coffee dark:bg-[#1f130e] dark:text-cream">
            {getCategoryName(product.category)}
          </span>
          {product.subcategory && (
            <span className="rounded-full bg-blush px-3 py-1 text-xs font-extrabold text-coffee">
              {getSubcategoryName(product.subcategory)}
            </span>
          )}
          {product.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/25 px-3 py-1 text-xs font-extrabold text-coffee dark:bg-gold dark:text-espresso">
              <Star size={13} fill="currentColor" /> Destaque #{product.featuredOrder ?? 999}
            </span>
          )}
          {product.tag && (
            <span className="rounded-full bg-caramel/12 px-3 py-1 text-xs font-extrabold text-caramel dark:bg-caramel/25 dark:text-gold">
              {product.tag}
            </span>
          )}
        </div>
        <div className="mt-4 grid gap-1 text-xs font-semibold text-coffee/60 dark:text-cream/60">
          <span className="inline-flex items-center gap-1">
            <Images size={14} /> {images.length} foto(s)
          </span>
          <span>Criado em {formatDate(product.createdAt)}</span>
          <span>Atualizado em {formatDate(product.updatedAt)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(product)}>
            <Edit3 size={16} /> Editar
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(product)} className="text-red-700 hover:bg-red-50">
            <Trash2 size={16} /> Excluir
          </Button>
        </div>
      </div>
    </article>
  );
}
