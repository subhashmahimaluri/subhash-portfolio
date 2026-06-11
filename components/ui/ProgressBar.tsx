interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  showPercentage?: boolean;
}

export function ProgressBar({ value, max = 100, label, showPercentage = false }: ProgressBarProps) {
  const pct = Math.floor((value / max) * 100);
  return (
    <div className="progress-bar" aria-label={label}>
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showPercentage && <span className="progress-bar__pct">{pct}%</span>}
    </div>
  );
}
