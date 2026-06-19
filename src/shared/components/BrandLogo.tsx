import logo from '../../assets/logo-ui.png';

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = 'h-12 w-12' }: BrandLogoProps) {
  return <img src={logo} alt="Cesta.com" className={`object-contain ${className}`} decoding="async" />;
}
