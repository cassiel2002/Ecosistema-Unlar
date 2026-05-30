import { BookOpen } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';

interface FreshmanGuide {
  id: string;
  title: string;
  content: string;
  category: 'procedures' | 'tips' | 'faq' | 'guide' | 'campus';
  order_index: number;
  career_id: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

interface GuideCardProps {
  guide: FreshmanGuide;
  onClick?: () => void;
}

const categoryLabels: Record<FreshmanGuide['category'], string> = {
  procedures: 'Trámites',
  tips: 'Consejos',
  faq: 'FAQ',
  guide: 'Guía',
  campus: 'Campus',
};

const categoryVariants: Record<FreshmanGuide['category'], 'info' | 'success' | 'warning' | 'default'> = {
  procedures: 'info',
  tips: 'success',
  faq: 'warning',
  guide: 'default',
  campus: 'info',
};

export function GuideCard({ guide, onClick }: GuideCardProps) {
  return (
    <article
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant={categoryVariants[guide.category]} size="sm">
            {categoryLabels[guide.category]}
          </Badge>
          <h3 className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {guide.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {guide.content}
          </p>
        </div>
      </div>
    </article>
  );
}

export type { FreshmanGuide };
