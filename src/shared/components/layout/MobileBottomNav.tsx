import { Home, Info, MessageCircle, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { buildWhatsAppUrl, customOrderMessage } from '../../services/whatsapp';

const navItems = [
  { label: 'Início', to: '/', icon: Home, external: false },
  { label: 'Catálogo', to: '/catalogo', icon: Search, external: false },
  { label: 'Como', to: '/#como-funciona', icon: Info, external: false },
  { label: 'Pedido', to: buildWhatsAppUrl(customOrderMessage()), icon: MessageCircle, external: true },
];

export function MobileBottomNav() {
  const location = useLocation();

  const isItemActive = (to: string, external: boolean) => {
    if (external) return false;

    const [pathname, hash = ''] = to.split('#');
    const targetPath = pathname || '/';
    const targetHash = hash ? `#${hash}` : '';

    if (targetHash) {
      return location.pathname === targetPath && location.hash === targetHash;
    }

    return location.pathname === targetPath && location.hash === '';
  };

  const itemClass = (isActive: boolean) =>
    `group flex h-[58px] flex-col items-center justify-center gap-1 rounded-[1.15rem] text-[11px] font-bold transition-all duration-300 ${
      isActive
        ? 'bg-coffee text-[#f6a21a] shadow-[0_10px_24px_rgba(75,47,36,0.22)] dark:bg-gold dark:text-espresso dark:shadow-[0_10px_24px_rgba(215,168,82,0.18)]'
        : 'text-[#df741f] hover:bg-coffee/7 hover:text-[#f08a24] dark:text-cream/68 dark:hover:bg-white/10 dark:hover:text-cream'
    }`;

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-[1.7rem] border border-coffee/12 bg-linen/96 p-2 shadow-premium ring-1 ring-coffee/10 backdrop-blur-3xl dark:border-white/12 dark:bg-[#2a1a13]/94 dark:ring-gold/10 md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.to, item.external);
          const content = (
            <>
              <span
                className={`grid h-6 w-6 place-items-center rounded-full transition ${
                  isActive ? 'text-current' : 'text-current group-hover:scale-105'
                }`}
              >
                <Icon size={18} strokeWidth={2.35} />
              </span>
              <span className="leading-none">{item.label}</span>
            </>
          );

          if (item.external) {
            return (
              <a key={item.label} href={item.to} target="_blank" rel="noreferrer" className={itemClass(false)}>
                {content}
              </a>
            );
          }

          return (
            <Link key={item.label} to={item.to} className={itemClass(isActive)}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
