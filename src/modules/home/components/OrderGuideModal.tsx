import { FormEvent, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { buildWhatsAppUrl } from '../../../shared/services/whatsapp';
import { brand } from '../../../shared/config/brand';

type OrderGuideModalProps = {
  open: boolean;
  onClose: () => void;
};

export function OrderGuideModal({ open, onClose }: OrderGuideModalProps) {
  const [occasion, setOccasion] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = [
      `Ola, ${brand.name}.`,
      '',
      'Gostaria de montar um pedido personalizado com estas informacoes:',
      `- Ocasiao: ${occasion || 'A definir'}`,
      `- Data desejada: ${date || 'A definir'}`,
      `- Faixa de investimento: ${budget || 'A definir'}`,
      `- Preferencias: ${preferences || 'A definir'}`,
      '',
      'Pode me ajudar com uma sugestao?',
    ].join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso/55 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="order-guide-title">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-[2rem] border border-white/70 bg-white p-5 shadow-premium dark:border-white/14 dark:bg-[#24150f]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-caramel">Pedido guiado</p>
            <h2 id="order-guide-title" className="mt-2 text-2xl font-extrabold text-coffee dark:text-cream">
              Monte a mensagem em segundos
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full text-coffee/60 transition hover:bg-coffee/5 hover:text-coffee dark:text-cream/70 dark:hover:bg-white/10 dark:hover:text-cream"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-coffee dark:text-cream">
            Ocasião
            <input value={occasion} onChange={(event) => setOccasion(event.target.value)} className="h-12 rounded-2xl border border-coffee/10 bg-cream px-4 text-sm outline-none focus:ring-2 focus:ring-gold/45 dark:border-white/14 dark:bg-[#1f130e]" placeholder="Aniversario, agradecimento, cafe da manha..." />
          </label>
          <label className="grid gap-2 text-sm font-bold text-coffee dark:text-cream">
            Data desejada
            <input value={date} onChange={(event) => setDate(event.target.value)} className="h-12 rounded-2xl border border-coffee/10 bg-cream px-4 text-sm outline-none focus:ring-2 focus:ring-gold/45 dark:border-white/14 dark:bg-[#1f130e]" placeholder="Ex: Sabado pela manha" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-coffee dark:text-cream">
            Faixa de investimento
            <input value={budget} onChange={(event) => setBudget(event.target.value)} className="h-12 rounded-2xl border border-coffee/10 bg-cream px-4 text-sm outline-none focus:ring-2 focus:ring-gold/45 dark:border-white/14 dark:bg-[#1f130e]" placeholder="Ex: Ate R$ 180" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-coffee dark:text-cream">
            Preferências
            <textarea value={preferences} onChange={(event) => setPreferences(event.target.value)} className="min-h-24 rounded-2xl border border-coffee/10 bg-cream px-4 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-gold/45 dark:border-white/14 dark:bg-[#1f130e]" placeholder="Itens favoritos, restricoes, mensagem, estilo..." />
          </label>
        </div>

        <Button type="submit" className="mt-6 w-full">
          <MessageCircle size={18} /> Enviar para WhatsApp
        </Button>
      </form>
    </div>
  );
}
