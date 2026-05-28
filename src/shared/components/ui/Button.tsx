import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-coffee text-cream shadow-premium hover:-translate-y-0.5 hover:bg-espresso dark:bg-gold dark:text-espresso',
  secondary:
    'border border-coffee/15 bg-white text-coffee shadow-sm hover:-translate-y-0.5 hover:border-gold/50 hover:bg-cream dark:border-white/20 dark:bg-cream dark:text-espresso dark:hover:bg-white',
  ghost: 'text-coffee hover:bg-coffee/5 dark:text-cream dark:hover:bg-white/10',
  dark: 'bg-espresso text-cream hover:-translate-y-0.5 hover:bg-coffee',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:pointer-events-none disabled:opacity-60';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type RouterLinkProps = CommonProps & LinkProps & { to: string };

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ');
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={classNames(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = 'primary',
  size = 'md',
  className,
  to,
  ...props
}: RouterLinkProps) {
  return (
    <Link className={classNames(base, variants[variant], sizes[size], className)} to={to} {...props}>
      {children}
    </Link>
  );
}

export function ButtonAnchor({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  ...props
}: AnchorProps) {
  return (
    <a className={classNames(base, variants[variant], sizes[size], className)} href={href} {...props}>
      {children}
    </a>
  );
}
