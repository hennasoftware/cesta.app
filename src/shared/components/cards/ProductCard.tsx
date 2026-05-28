import { motion } from 'framer-motion';
import { Gift, MessageCircle, Sparkles, Star, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { productOrderMessage, formatCurrency } from '../../services/whatsapp';
import { WhatsAppButton } from '../WhatsAppButton';
import { Badge } from '../ui/Badge';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[2rem] border border-coffee/8 bg-white shadow-premium backdrop-blur transition-shadow duration-300 hover:shadow-glow dark:border-white/14 dark:bg-[#24150f]"
    >
      <Link to={`/produto/${product.slug}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.08]"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-4 top-4">
            <Badge tone={product.featured ? 'rose' : 'gold'}>{product.tag}</Badge>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/produto/${product.slug}`} className="text-lg font-extrabold text-coffee transition hover:text-caramel dark:text-gold">
            {product.name}
          </Link>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold/18 px-2.5 py-1 text-xs font-bold text-coffee dark:bg-gold/20 dark:text-gold">
            <Star size={13} fill="currentColor" /> {product.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-coffee/72 dark:text-linen/90">{product.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-pistachio px-2.5 py-1 text-[11px] font-bold text-coffee dark:bg-pistachio dark:text-espresso">
            <Truck size={12} /> Entrega local
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-[11px] font-bold text-coffee dark:bg-blush dark:text-espresso">
            <Sparkles size={12} /> Personalizável
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/18 px-2.5 py-1 text-[11px] font-bold text-coffee dark:bg-gold/80 dark:text-espresso">
            <Gift size={12} /> Feito à mão
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-caramel dark:text-gold">A partir de</p>
            <p className="text-2xl font-extrabold text-coffee dark:text-linen">{formatCurrency(product.price)}</p>
          </div>
          <WhatsAppButton message={productOrderMessage(product.name)} size="sm" />
        </div>
        <Link
          to={`/produto/${product.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-caramel transition hover:text-coffee dark:text-gold dark:hover:text-linen"
        >
          Ver experiência <MessageCircle size={15} />
        </Link>
      </div>
    </motion.article>
  );
}
