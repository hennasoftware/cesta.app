import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso/55 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-5 shadow-premium dark:border-white/14 dark:bg-[#24150f]">
        <div className="flex items-start justify-between gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone === 'danger' ? 'bg-red-50 text-red-700' : 'bg-pistachio text-coffee'}`}>
            <AlertTriangle size={22} />
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="grid h-10 w-10 place-items-center rounded-full text-coffee/60 transition hover:bg-coffee/5 hover:text-coffee dark:text-cream/70 dark:hover:bg-white/10 dark:hover:text-cream"
            aria-label="Fechar"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>
        <h2 id="confirm-dialog-title" className="mt-5 text-2xl font-extrabold text-coffee dark:text-cream">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-coffee/72 dark:text-cream/78">{description}</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={tone === 'danger' ? 'bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:text-white dark:hover:bg-red-700' : undefined}
          >
            {loading ? 'Processando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
