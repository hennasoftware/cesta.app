import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', icon, ...props }, ref) => (
  <label className="flex h-12 items-center gap-3 rounded-full border border-coffee/10 bg-white px-4 text-coffee shadow-sm backdrop-blur dark:border-white/15 dark:bg-cream dark:text-espresso">
    {icon && <span className="text-caramel">{icon}</span>}
    <input
      ref={ref}
      className={`w-full bg-transparent text-sm outline-none placeholder:text-coffee/55 dark:placeholder:text-espresso/55 ${className}`}
      {...props}
    />
  </label>
));

Input.displayName = 'Input';
