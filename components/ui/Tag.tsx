type TagVariant = 'default' | 'blue' | 'green' | 'red' | 'yellow';

interface TagProps {
  label: string;
  variant?: TagVariant;
  onDismiss?: () => void;
}

export function Tag({ label, variant = 'default', onDismiss }: TagProps) {
  return (
    <span className={`tag tag--${variant}`}>
      {label}
      {onDismiss && (
        <button
          className="tag__dismiss"
          onClick={onDismiss}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
