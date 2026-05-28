import { Instagram, MapPin, MessageCircle, ShoppingBag } from 'lucide-react';
import { buildWhatsAppUrl, customOrderMessage } from '../../services/whatsapp';

export function Footer() {
  return (
    <footer className="border-t border-coffee/8 bg-white dark:border-white/14 dark:bg-espresso">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-coffee text-cream dark:bg-gold dark:text-espresso">
              <ShoppingBag size={21} />
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold text-coffee dark:text-cream">Cesta.com</p>
              <p className="text-sm font-semibold text-caramel">Conectando afetos</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-coffee/72 dark:text-cream/78">
            Cestas de café da manhã, presentes personalizados e kits afetivos montados artesanalmente em Guaratinguetá - SP.
          </p>
        </div>

        <div className="space-y-4 text-sm text-coffee/72 dark:text-cream/72">
          <p className="font-bold text-coffee dark:text-cream">Contato</p>
          <a className="flex items-center gap-3 hover:text-caramel" href={buildWhatsAppUrl(customOrderMessage())}>
            <MessageCircle size={17} /> WhatsApp: (12) 99999-9999
          </a>
          <a className="flex items-center gap-3 hover:text-caramel" href="https://instagram.com" target="_blank" rel="noreferrer">
            <Instagram size={17} /> @cesta.com
          </a>
          <p className="flex items-center gap-3">
            <MapPin size={17} /> Guaratinguetá - SP
          </p>
        </div>

        <div className="rounded-[2rem] border border-coffee/10 bg-cream p-6 dark:border-white/14 dark:bg-[#24150f]">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-caramel">Entrega especial</p>
          <p className="mt-3 text-lg font-bold text-coffee dark:text-cream">Pedidos personalizados para transformar datas em memória.</p>
        </div>
      </div>
      <div className="border-t border-coffee/8 py-5 text-center text-xs text-coffee/55 dark:border-white/10 dark:text-cream/50">
        © {new Date().getFullYear()} Cesta.com. Todos os direitos reservados.
      </div>
    </footer>
  );
}
