export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'free'
  | 'resolved'
  | 'urgent'
  | 'pinned';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  free: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-200',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  pinned: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  free: 'bg-secondary-500',
  resolved: 'bg-green-500',
  urgent: 'bg-red-500',
  pinned: 'bg-primary-500',
};

const sizeStyles: Record<'sm' | 'md', string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({ children, variant = 'default', size = 'sm', dot = false }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
