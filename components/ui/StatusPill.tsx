type PillStatus = 'active' | 'inactive' | 'pending';
type PillSize = 'sm' | 'md' | 'lg';

interface StatusPillProps {
  status: PillStatus;
  label?: string;
  size?: PillSize;
}

const STATUS_LABELS: Record<PillStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
};

export function StatusPill({ status, label, size = 'md' }: StatusPillProps) {
  const text = label ?? STATUS_LABELS[status];
  return (
    <span
      className={`status-pill status-pill--${status} status-pill--${size}`}
      role="status"
    >
      {text}
    </span>
  );
}
