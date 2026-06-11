type CounterVariant = 'default' | 'success' | 'warning' | 'danger';

interface CounterProps {
  value: number;
  label: string;
  variant?: CounterVariant;
  max?: number;
}

export function Counter({ value, label, variant = 'default', max }: CounterProps) {
  const capped = max !== undefined && value > max;
  const displayed = capped ? `${max}+` : String(value);
  return (
    <span
      className={`counter counter--${variant}`}
      aria-label={`${label}: ${displayed}`}
    >
      <span className="counter__value" aria-hidden="true">
        {displayed}
      </span>
    </span>
  );
}
