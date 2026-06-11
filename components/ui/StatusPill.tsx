type PillStatus = 'active' | 'inactive' | 'pending';

interface StatusPillProps {
  status: PillStatus;
  label?: string;
  icon?: string;
}

const STATUS_LABELS: Record<PillStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
};

export function StatusPill({ status, label, icon }: StatusPillProps) {
  const text = label ?? STATUS_LABELS[status];
  return (
    <span className={`status-pill status-pill--${status}`} role="status">
      {icon && <span className="status-pill__icon" aria-hidden="true">{icon}</span>}
      {text}
    </span>
  );
}
