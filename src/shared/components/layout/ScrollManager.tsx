import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = location.hash.replace('#', '');
    let attempts = 0;
    let timeoutId: number;

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        return;
      }

      attempts += 1;

      if (attempts < 12) {
        timeoutId = window.setTimeout(scrollToTarget, 80);
      }
    };

    timeoutId = window.setTimeout(scrollToTarget, 80);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.hash]);

  return null;
}
