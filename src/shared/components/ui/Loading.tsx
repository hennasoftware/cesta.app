import { Loader2 } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

type LoadingVariant = 'default' | 'catalog' | 'product' | 'adminList' | 'auth';

type LoadingProps = {
  label?: string;
  variant?: LoadingVariant;
};

export function Loading({ label = 'Carregando...' }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="flex w-full max-w-sm flex-col items-center rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-premium dark:border-white/14 dark:bg-[#24150f]">
        <div className="grid h-24 w-28 place-items-center overflow-hidden">
          <BrandLogo className="h-24 w-28" />
        </div>
        <Loader2 className="mt-6 animate-spin text-caramel" size={34} strokeWidth={2.6} />
        <p className="mt-4 text-sm font-extrabold text-coffee dark:text-cream">{label}</p>
        <p className="mt-2 text-xs font-semibold text-coffee/60 dark:text-cream/60">Aguarde um instante</p>
      </div>
    </div>
  );
}
