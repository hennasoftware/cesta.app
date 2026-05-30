import { Loader2 } from 'lucide-react';

type LoadingProps = {
  label?: string;
};

export function Loading({ label = 'Carregando...' }: LoadingProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-coffee dark:text-cream">
      <Loader2 className="animate-spin text-caramel" size={28} />
      <p className="text-sm font-bold">{label}</p>
    </div>
  );
}
