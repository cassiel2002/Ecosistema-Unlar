import { BadgeCheck } from 'lucide-react';
import type { AvatarProps } from '@/shared/types/ui';

const sizeStyles: Record<AvatarProps['size'], { container: string; text: string; badge: string }> = {
  xs: { container: 'h-6 w-6', text: 'text-xs', badge: 'h-3 w-3 -bottom-0.5 -right-0.5' },
  sm: { container: 'h-8 w-8', text: 'text-sm', badge: 'h-3.5 w-3.5 -bottom-0.5 -right-0.5' },
  md: { container: 'h-10 w-10', text: 'text-base', badge: 'h-4 w-4 -bottom-0.5 -right-0.5' },
  lg: { container: 'h-14 w-14', text: 'text-lg', badge: 'h-5 w-5 -bottom-0.5 -right-0.5' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-accent-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-violet-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ src, name, size, showVerified = false, isVerified = false }: AvatarProps) {
  const styles = sizeStyles[size];

  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${styles.container} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${styles.container} ${getColorFromName(name)} inline-flex items-center justify-center rounded-full`}
          aria-label={name}
        >
          <span className={`${styles.text} font-medium text-white`}>
            {getInitials(name)}
          </span>
        </div>
      )}
      {showVerified && isVerified && (
        <BadgeCheck
          className={`${styles.badge} absolute text-primary-500`}
          aria-label="Usuario verificado"
        />
      )}
    </div>
  );
}
