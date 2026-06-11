type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
}

const SIZE_PX: Record<AvatarSize, number> = { sm: 32, md: 48, lg: 64 };

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const px = SIZE_PX[size];
  return (
    <span
      className={`avatar avatar--${size}`}
      aria-label={name}
      role="img"
      style={{ width: px, height: px }}
    >
      {src ? (
        <img src={src} alt={name} className="avatar__img" />
      ) : (
        <span className="avatar__initials" aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
