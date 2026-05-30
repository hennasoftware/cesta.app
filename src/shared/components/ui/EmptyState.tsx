import type { ReactNode } from 'react';
import { PackageSearch } from 'lucide-react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-coffee/8 bg-white p-8 text-center shadow-sm dark:border-white/14 dark:bg-[#24150f]">
      <PackageSearch className="mx-auto text-caramel" size={34} />
      <h2 className="mt-4 text-xl font-extrabold text-coffee dark:text-cream">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-coffee/72 dark:text-cream/78">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
