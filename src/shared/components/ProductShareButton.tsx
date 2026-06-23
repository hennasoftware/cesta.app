import { Check, Link as LinkIcon, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';

type ProductShareButtonProps = {
  name: string;
  description: string;
  url: string;
  className?: string;
};

function getAbsoluteUrl(value: string) {
  return new URL(value, window.location.origin).toString();
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

export function ProductShareButton({
  name,
  description,
  url,
  className,
}: ProductShareButtonProps) {
  const [feedback, setFeedback] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (feedback === 'idle') return undefined;
    const timeout = window.setTimeout(() => setFeedback('idle'), 2500);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  async function handleShare() {
    const absoluteUrl = getAbsoluteUrl(url);
    const shareData: ShareData = {
      title: name,
      text: description || 'Confira esta cesta de presente que encontrei.',
      url: absoluteUrl,
    };

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    try {
      await copyText(absoluteUrl);
      setFeedback('copied');
    } catch {
      setFeedback('error');
    }
  }

  const label = feedback === 'copied' ? 'Link copiado' : feedback === 'error' ? 'Não foi possível copiar' : 'Compartilhar';
  const Icon = feedback === 'copied' ? Check : feedback === 'error' ? LinkIcon : Share2;

  return (
    <div className="relative shrink-0">
      {feedback !== 'idle' && (
        <span
          className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-full bg-espresso px-3 py-1.5 text-xs font-bold text-white shadow-lg dark:bg-cream dark:text-espresso"
          role="status"
        >
          {label}
        </span>
      )}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className={`!h-14 !w-14 !px-0 ${className ?? ''}`}
        onClick={() => void handleShare()}
        aria-label={label}
        title={label}
      >
        <Icon size={20} />
        <span className="sr-only">{label}</span>
      </Button>
    </div>
  );
}
