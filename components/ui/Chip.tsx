type ChipSize = 'sm' | 'md';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  size?: ChipSize;
}

export function Chip({ label, onRemove, size = 'md' }: ChipProps) {
  return (
    <span className={`chip chip--${size}`}>
      {label}
      {onRemove && (
        <button
          className="chip__remove"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
}
