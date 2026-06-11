type PillStatus = 'active' | 'inactive' | 'pending';

interface StatusPillProps {
  status: PillStatus;
  label?: string;
  dot?: boolean;
}

const STATUS_LABELS: Record<PillStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
};

export function StatusPill({ status, label, dot = false }: StatusPillProps) {
  const text = label ?? STATUS_LABELS[status];
  return (
    <span className={`status-pill status-pill--${status}`} role="status">
      {dot && <span className="status-pill__dot" aria-hidden="true" />}
      {text}
    </span>
  );
}
