import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, BookOpen, ClipboardList, Sun, Clock, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';

interface CalendarEventData {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  event_type: 'exam' | 'enrollment' | 'holiday' | 'deadline' | 'other';
  career_ids: string[];
  is_global: boolean;
  created_at: string;
}

interface CalendarEventProps {
  event: CalendarEventData;
}

const typeLabels: Record<CalendarEventData['event_type'], string> = {
  exam: 'Examen',
  enrollment: 'Inscripción',
  holiday: 'Feriado',
  deadline: 'Fecha límite',
  other: 'Otro',
};

const typeVariants: Record<CalendarEventData['event_type'], 'danger' | 'info' | 'success' | 'warning' | 'default'> = {
  exam: 'danger',
  enrollment: 'info',
  holiday: 'success',
  deadline: 'warning',
  other: 'default',
};

const typeIcons: Record<CalendarEventData['event_type'], React.ReactNode> = {
  exam: <BookOpen className="h-4 w-4" />,
  enrollment: <ClipboardList className="h-4 w-4" />,
  holiday: <Sun className="h-4 w-4" />,
  deadline: <Clock className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
};

export function CalendarEvent({ event }: CalendarEventProps) {
  const eventDate = new Date(event.event_date);
  const day = format(eventDate, 'd', { locale: es });
  const month = format(eventDate, 'MMM', { locale: es });
  const fullDate = format(eventDate, "EEEE d 'de' MMMM", { locale: es });

  return (
    <article className="flex gap-4 rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-sm dark:border-gray-700">
      {/* Date indicator */}
      <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-300">
          {day}
        </span>
        <span className="text-xs uppercase text-primary-500 dark:text-primary-400">
          {month}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={typeVariants[event.event_type]} size="sm">
            <span className="flex items-center gap-1">
              {typeIcons[event.event_type]}
              {typeLabels[event.event_type]}
            </span>
          </Badge>
          {event.is_global && (
            <Badge variant="default" size="sm">Global</Badge>
          )}
        </div>

        <h3 className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {event.title}
        </h3>

        {event.description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {event.description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          <span className="capitalize">{fullDate}</span>
          {event.end_date && (
            <span>
              {' '}— {format(new Date(event.end_date), "d 'de' MMMM", { locale: es })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export type { CalendarEventData };
