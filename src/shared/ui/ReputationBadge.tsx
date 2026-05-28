import { Star, Shield, Award, Crown } from 'lucide-react';
import type { ReputationBadgeProps } from '@/shared/types/ui';

interface ReputationLevel {
  label: string;
  icon: React.ReactNode;
  className: string;
  minScore: number;
}

const levels: ReputationLevel[] = [
  {
    label: 'Nuevo',
    icon: <Star className="h-3.5 w-3.5" />,
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    minScore: 0,
  },
  {
    label: 'Activo',
    icon: <Shield className="h-3.5 w-3.5" />,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    minScore: 100,
  },
  {
    label: 'Confiable',
    icon: <Award className="h-3.5 w-3.5" />,
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    minScore: 300,
  },
  {
    label: 'Destacado',
    icon: <Crown className="h-3.5 w-3.5" />,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
    minScore: 600,
  },
  {
    label: 'Leyenda',
    icon: <Crown className="h-3.5 w-3.5" />,
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    minScore: 900,
  },
];

function getLevel(score: number): ReputationLevel {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (score >= levels[i].minScore) {
      return levels[i];
    }
  }
  return levels[0];
}

const sizeStyles: Record<NonNullable<ReputationBadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
};

export function ReputationBadge({ score, size = 'sm' }: ReputationBadgeProps) {
  const level = getLevel(score);

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${level.className}
        ${sizeStyles[size]}
      `}
      title={`Reputación: ${score}/1000`}
      aria-label={`Reputación: ${level.label} (${score} puntos)`}
    >
      {level.icon}
      {level.label}
    </span>
  );
}
