import { MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { ButtonAnchor } from './ui/Button';
import { buildWhatsAppUrl } from '../services/whatsapp';

type WhatsAppButtonProps = {
  message: string;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function WhatsAppButton({ message, children = 'Pedir no WhatsApp', className, size = 'md' }: WhatsAppButtonProps) {
  return (
    <ButtonAnchor href={buildWhatsAppUrl(message)} target="_blank" rel="noreferrer" size={size} className={className}>
      <MessageCircle size={18} />
      {children}
    </ButtonAnchor>
  );
}
