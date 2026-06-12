type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
  title: string;
  messageHtml?: string;
  variant?: NotificationVariant;
  learnMoreUrl?: string;
}

export function Notification({
  title,
  messageHtml,
  variant = 'info',
  learnMoreUrl,
}: NotificationProps) {
  return (
    <div className={`notification notification--${variant}`} role="alert">
      <strong className="notification__title">{title}</strong>
      {messageHtml && (
        <p
          className="notification__body"
          dangerouslySetInnerHTML={{ __html: messageHtml }}
        />
      )}
      {learnMoreUrl && (
        <a href={learnMoreUrl} target="_blank" className="notification__link">
          Learn more
        </a>
      )}
    </div>
  );
}
