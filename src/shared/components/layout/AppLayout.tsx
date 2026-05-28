import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { BackToTopButton } from './BackToTopButton';
import { MobileBottomNav } from './MobileBottomNav';
import { ScrollManager } from './ScrollManager';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-soft-radial dark:bg-none dark:bg-espresso">
      <ScrollManager />
      <Header />
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <BackToTopButton />
    </div>
  );
}
