import { CalendarDays, MapPin, MessageCircle, Sparkles, X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildWhatsAppUrl, formatCurrency, qualifiedProductOrderMessage } from '../services/whatsapp';
import { Button } from './ui/Button';

export type ProductContactData = {
  name: string;
  price: number;
  url: string;
};

type ProductContactModalProps = {
  open: boolean;
  product: ProductContactData;
  onClose: () => void;
};

const fieldClassName =
  'h-12 w-full rounded-2xl border border-coffee/10 bg-cream px-4 text-sm text-coffee outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/35 dark:border-white/14 dark:bg-[#1f130e] dark:text-cream';

function getLocalToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export function ProductContactModal({ open, product, onClose }: ProductContactModalProps) {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [location, setLocation] = useState('');
  const [personalization, setPersonalization] = useState('');

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const productUrl = new URL(product.url, window.location.origin).toString();
    const message = qualifiedProductOrderMessage({
      productName: product.name,
      productPrice: product.price,
      productUrl,
      deliveryDate,
      location,
      personalization,
    });

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-espresso/60 px-3 pt-6 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-contact-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] border border-white/70 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-premium dark:border-white/14 dark:bg-[#24150f] sm:rounded-[2rem] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-caramel">Pedido rápido</p>
            <h2 id="product-contact-title" className="mt-2 text-2xl font-extrabold text-coffee dark:text-cream">
              Informe os dados da entrega
            </h2>
            <p className="mt-2 text-sm leading-6 text-coffee/65 dark:text-cream/70">
              Você será direcionado ao WhatsApp com a mensagem pronta.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-coffee/60 transition hover:bg-coffee/5 hover:text-coffee dark:text-cream/70 dark:hover:bg-white/10 dark:hover:text-cream"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-pistachio/65 px-4 py-3 dark:bg-[#123b39]">
          <p className="text-sm font-extrabold text-coffee dark:text-cream">{product.name}</p>
          <p className="mt-1 text-sm font-bold text-sage dark:text-[#64e3dd]">{formatCurrency(product.price)}</p>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-coffee dark:text-cream">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} className="text-caramel" /> Data desejada para entrega
            </span>
            <input
              type="date"
              required
              min={getLocalToday()}
              value={deliveryDate}
              onChange={(event) => setDeliveryDate(event.target.value)}
              className={fieldClassName}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-coffee dark:text-cream">
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-caramel" /> Bairro ou CEP
            </span>
            <input
              type="text"
              required
              autoComplete="postal-code"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={fieldClassName}
              placeholder="Ex: Centro - 12500-000"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-coffee dark:text-cream">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} className="text-caramel" /> Personalização desejada
              <span className="font-medium text-coffee/50 dark:text-cream/50">(opcional)</span>
            </span>
            <textarea
              value={personalization}
              onChange={(event) => setPersonalization(event.target.value)}
              className="min-h-24 w-full resize-y rounded-2xl border border-coffee/10 bg-cream px-4 py-3 text-sm leading-6 text-coffee outline-none transition placeholder:text-coffee/45 focus:border-gold/60 focus:ring-2 focus:ring-gold/35 dark:border-white/14 dark:bg-[#1f130e] dark:text-cream dark:placeholder:text-cream/45"
              placeholder="Ex: cartão com mensagem e embalagem rosa"
            />
          </label>
        </div>

        <Button type="submit" size="lg" className="mt-6 w-full bg-[#1f8f4d] text-white hover:bg-[#187a40] dark:bg-[#25d366] dark:text-espresso">
          <MessageCircle size={19} /> Continuar no WhatsApp
        </Button>
      </form>
    </div>,
    document.body,
  );
}
