import { Megaphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/Badge';
import type { Announcement } from '@/shared/types';

interface AnnouncementCardProps {
  announcement: Announcement;
  onClick?: () => void;
}

const priorityLabels: Record<Announcement['priority'], string> = {
  normal: 'Normal',
  important: 'Importante',
  urgent: 'Urgente',
};

const priorityVariants: Record<Announcement['priority'], 'default' | 'warning' | 'danger'> = {
  normal: 'default',
  important: 'warning',
  urgent: 'danger',
};

const sourceLabels: Record<Announcement['source'], string> = {
  student_center: 'Centro de Estudiantes',
  faculty: 'Facultad',
  community: 'Comunidad',
};

export function AnnouncementCard({ announcement, onClick }: AnnouncementCardProps) {
  const timeAgo = formatDistanceToNow(new Date(announcement.created_at), {
    addSuffix: true,
    locale: es,
  });

  const priorityBorderColors: Record<Announcement['priority'], string> = {
    normal: 'border-l-gray-300 dark:border-l-gray-600',
    important: 'border-l-amber-400 dark:border-l-amber-500',
    urgent: 'border-l-red-500 dark:border-l-red-500',
  };

  return (
    <article
      onClick={onClick}
      className={`cursor-pointer rounded-xl border border-gray-200 border-l-4 p-4 transition-shadow hover:shadow-md dark:border-gray-700 ${priorityBorderColors[announcement.priority]}`}
    >
      <div className="flex items-start gap-3">
        {/* Priority indicator */}
        <div className={`mt-0.5 flex-shrink-0 rounded-full p-2 ${
          announcement.priority === 'urgent'
            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
            : announcement.priority === 'important'
            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
        }`}>
          <Megaphone className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={priorityVariants[announcement.priority]} size="sm">
              {priorityLabels[announcement.priority]}
            </Badge>
            <Badge variant="default" size="sm">
              {sourceLabels[announcement.source]}
            </Badge>
            {announcement.is_pinned && <Badge variant="pinned" size="sm">Fijado</Badge>}
          </div>

          <h3 className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {announcement.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {announcement.description}
          </p>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-gray-400">{timeAgo}</span>
            {announcement.expires_at && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Vence: {new Date(announcement.expires_at).toLocaleDateString('es-AR')}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
