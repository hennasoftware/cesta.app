import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 420);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-24 right-4 z-50 grid h-12 w-12 place-items-center rounded-2xl border border-white/70 bg-coffee text-cream shadow-premium ring-1 ring-coffee/10 transition hover:-translate-y-0.5 hover:bg-espresso focus:outline-none focus:ring-2 focus:ring-gold/50 dark:border-gold/25 dark:bg-gold dark:text-espresso dark:hover:bg-cream md:bottom-6 md:right-6"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
