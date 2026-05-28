import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  tone?: 'gold' | 'rose' | 'coffee' | 'sage';
};

const tones = {
  gold: 'bg-gold/22 text-espresso ring-gold/35 dark:bg-gold/18 dark:text-gold',
  rose: 'bg-rose/28 text-espresso ring-rose/35 dark:bg-rose/18 dark:text-blush',
  coffee: 'bg-coffee/12 text-coffee ring-coffee/14 dark:bg-cream dark:text-espresso',
  sage: 'bg-sage/22 text-espresso ring-sage/35 dark:bg-sage/18 dark:text-pistachio',
};

export function Badge({ children, tone = 'gold' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}
