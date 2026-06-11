type PillStatus = 'active' | 'inactive' | 'pending';

interface StatusPillProps {
  status: PillStatus;
  label?: string;
}

const STATUS_LABELS: Record<PillStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
};

export function StatusPill({ status, label }: StatusPillProps) {
  const text = label ?? STATUS_LABELS[status];
  return (
    <span className={`status-pill status-pill--${status}`} role="status">
      {text}
    </span>
  );
}
