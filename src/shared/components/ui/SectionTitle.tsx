import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  inverted?: boolean;
};

export function SectionTitle({ eyebrow, title, description, action, inverted = false }: SectionTitleProps) {
  const titleClass = inverted ? 'text-cream' : 'text-coffee dark:text-gold';
  const descriptionClass = inverted ? 'text-cream/82' : 'text-coffee/74 dark:text-linen/90';

  return (
    <motion.div
      className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-caramel dark:text-gold">{eyebrow}</p>}
        <h2 className={`font-display text-3xl font-extrabold md:text-5xl ${titleClass}`}>{title}</h2>
        {description && <p className={`mt-4 text-base leading-7 ${descriptionClass}`}>{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
