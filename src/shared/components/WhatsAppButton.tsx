import { MessageCircle } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button, ButtonAnchor } from './ui/Button';
import { buildWhatsAppUrl } from '../services/whatsapp';
import { ProductContactModal, type ProductContactData } from './ProductContactModal';

type WhatsAppButtonProps = {
  message: string;
  product?: ProductContactData;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function WhatsAppButton({ message, product, children = 'Pedir no WhatsApp', className, size = 'md' }: WhatsAppButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (product) {
    return (
      <>
        <Button type="button" size={size} className={className} onClick={() => setIsModalOpen(true)}>
          <MessageCircle size={18} />
          {children}
        </Button>
        <ProductContactModal open={isModalOpen} product={product} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <ButtonAnchor href={buildWhatsAppUrl(message)} target="_blank" rel="noreferrer" size={size} className={className}>
      <MessageCircle size={18} />
      {children}
    </ButtonAnchor>
  );
}
