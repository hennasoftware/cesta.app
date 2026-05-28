import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types/product';

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.article whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
      <Link
        to={`/catalogo?categoria=${category.id}`}
        className="group block overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-premium backdrop-blur dark:border-white/14 dark:bg-[#24150f]"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            src={category.image}
            alt={category.name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/68 via-espresso/10 to-transparent" />
          <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-coffee backdrop-blur">
            <ArrowUpRight size={18} />
          </span>
          <div className="absolute bottom-0 p-5">
            <h3 className="text-xl font-extrabold text-white">{category.name}</h3>
            <p className="mt-2 text-sm leading-6 text-white/82">{category.description}</p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
