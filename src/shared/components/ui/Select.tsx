import type { ReactNode } from 'react';
import ReactSelect, { type SingleValue, type StylesConfig } from 'react-select';

export type SelectOption<Value extends string> = {
  value: Value;
  label: string;
};

type SelectProps<Value extends string> = {
  value: Value;
  options: Array<SelectOption<Value>>;
  onChange: (value: Value) => void;
  ariaLabel: string;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
};

function sortOptions<Value extends string>(options: Array<SelectOption<Value>>) {
  return [...options].sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' }));
}

const selectStyles: StylesConfig<SelectOption<string>, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 0,
    border: 0,
    boxShadow: state.isFocused ? '0 0 0 2px rgba(217, 174, 102, 0.42)' : 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
  }),
  input: (base) => ({
    ...base,
    color: 'inherit',
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    color: 'inherit',
    fontWeight: 700,
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgba(84, 52, 35, 0.55)',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    color: 'inherit',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '0 0 0 0.5rem',
  }),
  menu: (base) => ({
    ...base,
    width: 'max-content',
    minWidth: '100%',
    maxWidth: 'min(20rem, calc(100vw - 2rem))',
    zIndex: 80,
    overflow: 'hidden',
    borderRadius: '1rem',
    border: '1px solid rgba(84, 52, 35, 0.1)',
    boxShadow: '0 18px 45px rgba(36, 21, 15, 0.16)',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: '0.35rem',
    overflowX: 'hidden',
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.875rem',
    color: '#543423',
    backgroundColor: state.isSelected ? '#f3cf78' : state.isFocused ? 'rgba(217, 174, 102, 0.22)' : 'transparent',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
  }),
};

export function Select<Value extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder,
  icon,
  className = '',
}: SelectProps<Value>) {
  const sortedOptions = sortOptions(options);
  const selectedOption = sortedOptions.find((option) => option.value === value) ?? null;

  function handleChange(option: SingleValue<SelectOption<Value>>) {
    if (option) onChange(option.value);
  }

  return (
    <label className={`flex h-12 min-w-0 items-center gap-2 rounded-full border border-coffee/10 bg-white px-4 text-sm text-coffee shadow-sm backdrop-blur dark:border-white/15 dark:bg-cream dark:text-espresso sm:min-w-44 ${className}`}>
      {icon && <span className="shrink-0 text-caramel">{icon}</span>}
      <ReactSelect
        aria-label={ariaLabel}
        className="min-w-0 flex-1"
        value={selectedOption}
        options={sortedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        isSearchable={false}
        menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
        menuPosition="fixed"
        styles={selectStyles as unknown as StylesConfig<SelectOption<Value>, false>}
      />
    </label>
  );
}
