import { ChevronRight, ExternalLink, FolderTree, LogOut, Menu, Moon, Package, Plus, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../../shared/components/BrandLogo';
import { useDarkMode } from '../../../shared/hooks/useDarkMode';

export type AdminView = 'products' | 'form' | 'categories';

type AdminLayoutProps = {
  activeView: AdminView;
  userEmail?: string | null;
  onProducts: () => void;
  onNewProduct: () => void;
  onCategories: () => void;
  onLogout: () => void;
  children: ReactNode;
};

const navigation = [
  { id: 'products' as const, label: 'Produtos', icon: Package },
  { id: 'form' as const, label: 'Nova cesta', icon: Plus },
  { id: 'categories' as const, label: 'Categorias', icon: FolderTree },
];

const desktopNavigation = navigation.filter(({ id }) => id !== 'form');

export function AdminLayout({
  activeView,
  userEmail,
  onProducts,
  onNewProduct,
  onCategories,
  onLogout,
  children,
}: AdminLayoutProps) {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlers: Record<AdminView, () => void> = {
    products: onProducts,
    form: onNewProduct,
    categories: onCategories,
  };

  function handleNavigation(view: AdminView) {
    setMobileMenuOpen(false);
    handlers[view]();
  }

  function handleLogout() {
    setMobileMenuOpen(false);
    onLogout();
  }

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#f8f2ea] text-coffee dark:bg-[#170c09] dark:text-cream">
      <header className="relative z-40 border-b border-coffee/10 bg-white/92 shadow-[0_10px_30px_rgba(74,33,23,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-[#24150f]/92 lg:sticky lg:top-0">
        <div className="mx-auto flex max-w-[90rem] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 lg:mr-5">
            <BrandLogo className="h-10 w-10 shrink-0" />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-extrabold text-coffee dark:text-cream">Cesta.com Admin</p>
              <p className="hidden truncate text-xs font-semibold text-coffee/55 dark:text-cream/55 sm:block">
                Gestao do catalogo
              </p>
            </div>
          </div>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Navegacao administrativa">
            {desktopNavigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={handlers[id]}
                aria-current={activeView === id ? 'page' : undefined}
                className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-extrabold transition ${
                  activeView === id
                    ? 'bg-coffee text-cream shadow-[0_10px_24px_rgba(74,33,23,0.18)] dark:bg-gold dark:text-espresso'
                    : 'text-coffee/65 hover:bg-cream dark:text-cream/70 dark:hover:bg-white/10'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>

          {userEmail && (
            <span className="ml-auto hidden max-w-52 truncate rounded-full border border-coffee/10 bg-coffee/6 px-3 py-2 text-xs font-bold text-coffee/65 dark:border-white/10 dark:bg-white/8 dark:text-cream/65 xl:block">
              {userEmail}
            </span>
          )}

          <Link
            to="/"
            title="Voltar ao site"
            aria-label="Voltar ao site publico"
            className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-coffee/10 bg-white/60 px-3 text-sm font-extrabold text-coffee transition hover:bg-cream dark:border-white/15 dark:bg-white/5 dark:text-cream dark:hover:bg-white/10 lg:inline-flex"
          >
            <ExternalLink size={16} />
            <span className="hidden md:inline">Ver site</span>
          </Link>

          <button
            type="button"
            onClick={toggleDarkMode}
            title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-coffee/10 bg-white/60 text-coffee transition hover:bg-cream dark:border-white/15 dark:bg-white/5 dark:text-cream dark:hover:bg-white/10 lg:inline-flex"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            type="button"
            onClick={onLogout}
            title="Sair do painel"
            aria-label="Sair do painel administrativo"
            className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-coffee/10 bg-white/60 px-3 text-sm font-extrabold text-coffee transition hover:bg-cream dark:border-white/15 dark:bg-white/5 dark:text-cream dark:hover:bg-white/10 lg:inline-flex"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="admin-mobile-menu"
            aria-label="Abrir menu administrativo"
            className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-coffee/10 bg-white/70 text-coffee shadow-[0_8px_22px_rgba(74,33,23,0.08)] transition hover:bg-cream dark:border-white/15 dark:bg-white/5 dark:text-cream dark:hover:bg-white/10 lg:hidden"
          >
            <Menu size={21} />
          </button>
        </div>
      </header>

      <main>{children}</main>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="admin-mobile-menu"
            className="fixed inset-0 z-[100] flex justify-end lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <motion.button
              type="button"
              aria-label="Fechar menu administrativo"
              className="absolute inset-0 cursor-default bg-[#160a06]/78 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-mobile-menu-title"
              className="relative z-10 flex h-dvh w-[min(88vw,24rem)] flex-col overflow-hidden border-l border-coffee/15 bg-[#fffaf5] shadow-[-24px_0_70px_rgba(22,10,6,0.38)] dark:border-white/10 dark:bg-[#1e110c]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36, mass: 0.8 }}
            >
              <div className="shrink-0 border-b border-coffee/10 bg-[#fffaf5] px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] dark:border-white/10 dark:bg-[#1e110c]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-black uppercase tracking-[0.24em] text-caramel">Menu admin</p>
                    <h2
                      id="admin-mobile-menu-title"
                      className="mt-1 text-lg font-extrabold text-coffee dark:text-cream"
                    >
                      Atalhos rápidos
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-coffee/65 dark:text-cream/65">
                      Acesso direto às áreas principais do painel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Fechar menu administrativo"
                    autoFocus
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-coffee/10 bg-white text-coffee shadow-sm transition hover:bg-cream focus:outline-none focus:ring-2 focus:ring-caramel/60 dark:border-white/10 dark:bg-white/10 dark:text-cream dark:hover:bg-white/15"
                  >
                    <X size={18} />
                  </button>
                </div>

                {userEmail && (
                  <div className="mt-4 rounded-2xl border border-coffee/10 bg-white px-3 py-2.5 text-xs font-bold text-coffee/70 dark:border-white/10 dark:bg-white/5 dark:text-cream/70">
                    <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-coffee/45 dark:text-cream/45">
                      Conta ativa
                    </span>
                    <span className="mt-1 block truncate">{userEmail}</span>
                  </div>
                )}
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <nav className="grid gap-2" aria-label="Navegacao administrativa mobile">
                  {navigation.map(({ id, label, icon: Icon }) => {
                    const active = activeView === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleNavigation(id)}
                        aria-current={active ? 'page' : undefined}
                        className={`group flex min-h-14 items-center gap-3 rounded-2xl border px-4 text-left text-sm font-extrabold transition ${
                          active
                            ? 'border-coffee/10 bg-coffee text-cream shadow-[0_14px_26px_rgba(74,33,23,0.18)] dark:border-white/10 dark:bg-gold dark:text-espresso'
                            : 'border-coffee/10 bg-white text-coffee hover:bg-cream dark:border-white/10 dark:bg-white/5 dark:text-cream dark:hover:bg-white/10'
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                            active
                              ? 'bg-white/12 text-current'
                              : 'bg-coffee/5 text-coffee dark:bg-white/10 dark:text-cream'
                          }`}
                        >
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0 flex-1">{label}</span>
                        <ChevronRight
                          size={16}
                          className={`shrink-0 transition ${
                            active ? 'opacity-100' : 'text-coffee/45 group-hover:translate-x-0.5 dark:text-cream/45'
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-auto grid grid-cols-2 gap-2.5 border-t border-coffee/10 pt-3 dark:border-white/10">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-coffee/10 bg-white text-sm font-extrabold text-coffee transition hover:bg-cream dark:border-white/10 dark:bg-white/5 dark:text-cream dark:hover:bg-white/10"
                  >
                    <ExternalLink size={17} /> Ver site
                  </Link>
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-coffee/10 bg-white text-sm font-extrabold text-coffee transition hover:bg-cream dark:border-white/10 dark:bg-white/5 dark:text-cream dark:hover:bg-white/10"
                  >
                    {isDark ? <Sun size={17} /> : <Moon size={17} />} Tema
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-50 text-sm font-extrabold text-red-700 transition hover:bg-red-100 dark:bg-red-950/35 dark:text-red-300 dark:hover:bg-red-950/50"
                  >
                    <LogOut size={17} /> Sair
                  </button>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
