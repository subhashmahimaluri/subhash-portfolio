type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  count?: number;
}

export function Badge({ label, variant = 'default', count }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>
      {label}
      {count !== undefined && (
        <span className="badge__count">{count > 99 ? '99+' : count}</span>
      )}
    </span>
  );
}
