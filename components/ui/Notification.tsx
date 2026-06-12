type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
  title: string;
  message?: string;
  variant?: NotificationVariant;
  learnMoreUrl?: string;
}

export function Notification({
  title,
  message,
  variant = 'info',
  learnMoreUrl,
}: NotificationProps) {
  return (
    <div className={`notification notification--${variant}`} role="alert">
      <strong className="notification__title">{title}</strong>
      {message && (
        <p className="notification__body">{message}</p>
      )}
      {learnMoreUrl && (
        <a
          href={learnMoreUrl}
          className="notification__link"
        >
          Learn more
        </a>
      )}
    </div>
  );
}
