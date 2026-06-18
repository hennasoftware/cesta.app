import { Gift, MessageCircle, Sparkles, Star, Truck } from 'lucide-react';
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
    <article className="group flex h-full min-h-[560px] flex-col overflow-hidden rounded-[1.5rem] border border-coffee/8 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/14 dark:bg-[#24150f]">
      <Link to={`/produto/${product.slug}`} className="block">
        <div className="relative h-56 overflow-hidden bg-cream sm:h-60">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center rounded-full border border-white/70 bg-white px-3.5 py-1.5 text-xs font-extrabold text-espresso shadow-[0_10px_30px_rgba(36,21,15,0.28)]">
              {product.tag}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="grid min-h-[58px] grid-cols-[1fr_auto] items-start gap-3">
          <Link to={`/produto/${product.slug}`} className="line-clamp-2 text-lg font-extrabold leading-7 text-coffee transition hover:text-caramel dark:text-gold">
            {product.name}
          </Link>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold/18 px-2.5 py-1 text-xs font-bold text-coffee dark:bg-gold/20 dark:text-gold">
            <Star size={13} fill="currentColor" /> {product.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-3 min-h-[72px] line-clamp-3 text-sm leading-6 text-coffee/72 dark:text-linen/90">{product.description}</p>

        <div className="mt-4 grid min-h-[72px] content-start grid-cols-2 gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-pistachio px-2.5 py-1 text-[11px] font-bold text-coffee dark:bg-pistachio dark:text-espresso">
            <Truck size={12} /> Entrega local
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-[11px] font-bold text-coffee dark:bg-blush dark:text-espresso">
            <Sparkles size={12} /> Personalizavel
          </span>
          <span className="col-span-2 inline-flex w-fit items-center gap-1 rounded-full bg-gold/18 px-2.5 py-1 text-[11px] font-bold text-coffee dark:bg-gold/80 dark:text-espresso">
            <Gift size={12} /> Feito a mao
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-caramel dark:text-gold">A partir de</p>
            <p className="text-2xl font-extrabold text-coffee dark:text-linen">{formatCurrency(product.price)}</p>
          </div>
        </div>

        <WhatsAppButton
          message={productOrderMessage(product.name)}
          size="md"
          className="mt-5 w-full bg-[#1f8f4d] text-white shadow-[0_12px_28px_rgba(31,143,77,0.25)] hover:bg-[#187a40] dark:bg-[#25d366] dark:text-espresso dark:hover:bg-[#31df73]"
        >
          Pedir no WhatsApp
        </WhatsAppButton>

        <Link
          to={`/produto/${product.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-caramel transition hover:text-coffee dark:text-gold dark:hover:text-linen"
        >
          Ver experiencia <MessageCircle size={15} />
        </Link>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
