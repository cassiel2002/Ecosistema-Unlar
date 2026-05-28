export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

function SkeletonBase({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  );
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width ?? undefined,
    height: height ?? undefined,
  };

  if (variant === 'circular') {
    return (
      <SkeletonBase
        className={`rounded-full ${className}`}
        {...(width || height ? { className: `rounded-full ${className}` } : {})}
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <div style={style}>
        <SkeletonBase className={`h-full w-full rounded-lg ${className}`} />
      </div>
    );
  }

  // Text variant with multiple lines
  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBase
            key={i}
            className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={style}>
      <SkeletonBase className={`h-4 w-full ${className}`} />
    </div>
  );
}

// Pre-built skeleton patterns for common use cases
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700" aria-hidden="true">
      <SkeletonBase className="mb-3 h-40 w-full rounded-lg" />
      <SkeletonBase className="mb-2 h-5 w-3/4" />
      <SkeletonBase className="mb-2 h-4 w-full" />
      <SkeletonBase className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 py-3" aria-hidden="true">
      <SkeletonBase className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBase className="h-4 w-1/3" />
        <SkeletonBase className="h-3 w-2/3" />
      </div>
    </div>
  );
}
