import { Search } from 'lucide-react';
import { Input } from './ui/Input';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <Input
      icon={<Search size={18} />}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar por cesta, ocasião ou presente"
      aria-label="Buscar produtos"
    />
  );
}
