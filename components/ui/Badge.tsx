type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ label, variant = 'default', dot = false }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`} aria-label={label}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {label}
    </span>
  );
}
