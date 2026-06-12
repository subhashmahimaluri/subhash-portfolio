type ChipVariant = 'filled' | 'outlined';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  selected?: boolean;
  onClick?: () => void;
}

export function Chip({ label, variant = 'filled', selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip chip--${variant}${selected ? ' chip--selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
