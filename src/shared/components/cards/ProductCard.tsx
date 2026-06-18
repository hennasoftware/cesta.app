import { ArrowUpRight, Gift, Sparkles, Star, Truck } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { productOrderMessage, formatCurrency } from '../../services/whatsapp';
import { WhatsAppButton } from '../WhatsAppButton';

type ProductCardProps = {
  product: Product;
};

function ProductCardComponent({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-coffee/10 bg-white shadow-[0_10px_30px_rgba(74,33,23,0.08)] transition duration-300 hover:-translate-y-1 hover:border-caramel/25 hover:shadow-[0_20px_45px_rgba(74,33,23,0.14)] dark:border-white/14 dark:bg-[#24150f] sm:min-h-[548px]">
      <Link to={`/produto/${product.slug}`} className="block p-2 pb-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-cream sm:aspect-auto sm:h-60">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
            <span className="inline-flex items-center rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-espresso shadow-[0_8px_24px_rgba(36,21,15,0.18)] backdrop-blur">
              {product.tag}
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-white/60 bg-white/95 px-2.5 py-1.5 text-xs font-extrabold text-coffee shadow-[0_8px_24px_rgba(36,21,15,0.18)] backdrop-blur">
              <Star size={12} fill="currentColor" className="text-gold" /> {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="sm:min-h-[58px]">
          <Link to={`/produto/${product.slug}`} className="line-clamp-2 text-lg font-extrabold leading-6 text-coffee transition hover:text-caramel dark:text-gold sm:leading-7">
            {product.name}
          </Link>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-coffee/68 dark:text-linen/85 sm:mt-3 sm:min-h-[72px] sm:line-clamp-3">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-2 border-y border-coffee/8 py-3 dark:border-white/10 sm:min-h-[72px] sm:content-center sm:py-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-pistachio px-2.5 py-1 text-[10px] font-bold text-coffee dark:bg-pistachio dark:text-espresso sm:text-[11px]">
            <Truck size={12} /> Entrega local
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-[10px] font-bold text-coffee dark:bg-blush dark:text-espresso sm:text-[11px]">
            <Sparkles size={12} /> Personalizavel
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/18 px-2.5 py-1 text-[10px] font-bold text-coffee dark:bg-gold/80 dark:text-espresso sm:text-[11px]">
            <Gift size={12} /> Feito a mao
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4 sm:pt-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-caramel dark:text-gold sm:text-[11px]">A partir de</p>
            <p className="text-[1.4rem] font-extrabold leading-tight text-coffee dark:text-linen sm:text-2xl">{formatCurrency(product.price)}</p>
          </div>
          <Link
            to={`/produto/${product.slug}`}
            aria-label={`Ver detalhes de ${product.name}`}
            title="Ver detalhes"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-coffee/12 text-coffee transition hover:border-caramel hover:bg-cream hover:text-caramel dark:border-white/15 dark:text-cream dark:hover:bg-white/10 sm:hidden"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <WhatsAppButton
          message={productOrderMessage(product.name)}
          size="md"
          className="mt-4 w-full bg-[#1f8f4d] text-white shadow-[0_10px_24px_rgba(31,143,77,0.22)] hover:bg-[#187a40] dark:bg-[#25d366] dark:text-espresso dark:hover:bg-[#31df73] sm:mt-5"
        >
          Pedir no WhatsApp
        </WhatsAppButton>

        <Link
          to={`/produto/${product.slug}`}
          className="mt-4 hidden items-center gap-2 text-sm font-bold text-caramel transition hover:text-coffee dark:text-gold dark:hover:text-linen sm:inline-flex"
        >
          Ver experiencia <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
