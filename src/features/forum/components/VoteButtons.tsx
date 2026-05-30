import { ChevronUp, ChevronDown } from 'lucide-react';

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  onVote: (direction: 'up' | 'down') => void;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md';
}

export function VoteButtons({
  upvotes,
  downvotes,
  userVote,
  onVote,
  orientation = 'vertical',
  size = 'md',
}: VoteButtonsProps) {
  const score = upvotes - downvotes;
  const isVertical = orientation === 'vertical';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const buttonSize = size === 'sm' ? 'min-h-[32px] min-w-[32px]' : 'min-h-[44px] min-w-[44px]';

  return (
    <div
      className={`flex items-center gap-0.5 ${isVertical ? 'flex-col' : 'flex-row'}`}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onVote('up');
        }}
        className={`
          ${buttonSize} inline-flex items-center justify-center rounded-lg transition-colors
          ${
            userVote === 'up'
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200'
          }
        `}
        aria-label="Votar a favor"
        aria-pressed={userVote === 'up'}
      >
        <ChevronUp className={iconSize} />
      </button>

      <span
        className={`
          text-center font-semibold
          ${size === 'sm' ? 'min-w-[24px] text-sm' : 'min-w-[32px] text-base'}
          ${score > 0 ? 'text-primary-600 dark:text-primary-400' : ''}
          ${score < 0 ? 'text-red-500 dark:text-red-400' : ''}
          ${score === 0 ? 'text-gray-500 dark:text-gray-400' : ''}
        `}
      >
        {score}
      </span>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onVote('down');
        }}
        className={`
          ${buttonSize} inline-flex items-center justify-center rounded-lg transition-colors
          ${
            userVote === 'down'
              ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200'
          }
        `}
        aria-label="Votar en contra"
        aria-pressed={userVote === 'down'}
      >
        <ChevronDown className={iconSize} />
      </button>
    </div>
  );
}
