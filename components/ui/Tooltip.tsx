type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: TooltipPosition;
  id?: string;
}

export function Tooltip({ content, children, position = 'top', id }: TooltipProps) {
  const tooltipId = id ?? `tooltip-${content.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  return (
    <span className="tooltip-wrapper">
      <span
        className="tooltip-trigger"
        aria-describedby={tooltipId}
      >
        {children}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className={`tooltip tooltip--${position}`}
      >
        {content}
      </span>
    </span>
  );
}
