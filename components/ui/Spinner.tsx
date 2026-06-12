type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
}

export function Spinner({ size = 'md', label = 'Loading…' }: SpinnerProps) {
  return (
    <span
      className={`spinner spinner--${size}`}
      role="status"
      aria-label={label}
    >
      <span className="spinner__track" aria-hidden="true" />
    </span>
  );
}
