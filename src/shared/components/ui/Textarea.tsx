import { forwardRef, type TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className = '', ...props }, ref) => (
  <label className="block rounded-[1.5rem] border border-coffee/10 bg-white px-4 py-3 text-coffee shadow-sm backdrop-blur dark:border-white/15 dark:bg-cream dark:text-espresso">
    <textarea
      ref={ref}
      className={`min-h-28 w-full resize-y bg-transparent text-sm leading-6 outline-none placeholder:text-coffee/55 dark:placeholder:text-espresso/55 ${className}`}
      {...props}
    />
  </label>
));

Textarea.displayName = 'Textarea';
