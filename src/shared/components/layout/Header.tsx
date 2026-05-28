import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Home, Info, Menu, Moon, Search, ShoppingBag, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { buildWhatsAppUrl, customOrderMessage } from '../../services/whatsapp';

const navItems = [
  { label: 'Início', to: '/', icon: Home },
  { label: 'Catálogo', to: '/catalogo', icon: Search },
  { label: 'Como funciona', to: '/#como-funciona', icon: Info },
];

function BrandMark() {
  return (
    <span className="relative grid h-12 w-12 place-items-center rounded-[1.35rem] bg-coffee text-cream shadow-glow dark:bg-gold dark:text-espresso">
      <ShoppingBag size={21} />
      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose text-white ring-2 ring-cream dark:ring-espresso">
        <Gift size={11} />
      </span>
    </span>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const isItemActive = (to: string) => {
    const [pathname, hash = ''] = to.split('#');
    const targetPath = pathname || '/';
    const targetHash = hash ? `#${hash}` : '';

    if (targetHash) {
      return location.pathname === targetPath && location.hash === targetHash;
    }

    return location.pathname === targetPath && location.hash === '';
  };

  const desktopLinkClass = (isActive: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-coffee text-cream dark:bg-gold dark:text-espresso' : 'text-coffee/75 hover:bg-coffee/7 dark:text-cream/75'
    }`;

  const mobileLinkClass = (isActive: boolean) =>
    `flex h-12 items-center justify-between rounded-2xl px-4 text-sm font-bold transition ${
      isActive
        ? 'bg-coffee text-cream shadow-sm dark:bg-gold dark:text-espresso'
        : 'bg-white text-espresso ring-1 ring-coffee/8 hover:bg-cream dark:bg-cream dark:text-espresso dark:ring-gold/15 dark:hover:bg-white'
    }`;

  const actionClass =
    'inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gold/50';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-coffee/8 bg-cream/86 backdrop-blur-xl dark:border-white/10 dark:bg-espresso/88">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Cesta.com">
          <BrandMark />
          <span>
            <span className="block font-display text-2xl font-extrabold text-coffee dark:text-cream">Cesta.com</span>
            <span className="block text-xs font-semibold text-caramel">Conectando afetos</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={desktopLinkClass(isItemActive(item.to))}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            className="inline-flex h-10 items-center justify-center rounded-full border border-coffee/12 bg-white px-4 text-sm font-bold text-espresso shadow-sm transition hover:bg-cream dark:border-gold/25 dark:bg-cream dark:text-espresso dark:hover:bg-white"
            onClick={toggleDarkMode}
            type="button"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href={buildWhatsAppUrl(customOrderMessage())}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-coffee px-4 text-sm font-bold text-cream shadow-sm transition hover:bg-espresso dark:bg-gold dark:text-espresso dark:hover:bg-cream"
          >
            Pedido
          </a>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-coffee/10 bg-white text-espresso shadow-sm ring-1 ring-white/70 transition hover:bg-cream focus:outline-none focus:ring-2 focus:ring-gold/50 dark:border-gold/25 dark:bg-cream dark:text-espresso md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Abrir menu"
          type="button"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? 'close' : 'menu'}
              initial={{ rotate: -45, scale: 0.72, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 45, scale: 0.72, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 top-20 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 w-full cursor-default bg-espresso/18 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} aria-label="Fechar menu" type="button" />
            <motion.div
              className="relative border-t border-coffee/10 bg-cream px-4 pb-5 shadow-premium ring-1 ring-white/70 backdrop-blur-3xl dark:border-gold/20 dark:bg-[#2a1a13] dark:ring-gold/10"
              initial={{ y: -18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -14, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <nav className="mx-auto flex max-w-7xl flex-col gap-2 pt-4">
                {navItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.2 }}
                    >
                      <Link to={item.to} className={mobileLinkClass(isItemActive(item.to))} onClick={() => setIsOpen(false)}>
                        <span className="flex items-center gap-3">
                          <Icon size={18} strokeWidth={2.35} />
                          {item.label}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-current opacity-35" />
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    className={`${actionClass} bg-white text-espresso ring-1 ring-coffee/8 hover:bg-cream dark:bg-cream dark:text-espresso dark:ring-gold/15 dark:hover:bg-white`}
                    onClick={toggleDarkMode}
                    type="button"
                  >
                    {isDark ? <Sun size={17} /> : <Moon size={17} />}
                    Tema
                  </button>
                  <a
                    href={buildWhatsAppUrl(customOrderMessage())}
                    target="_blank"
                    rel="noreferrer"
                    className={`${actionClass} bg-coffee text-cream hover:bg-espresso dark:bg-gold dark:text-espresso dark:hover:bg-cream`}
                  >
                    Pedido
                  </a>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
