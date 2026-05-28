import { Calendar, MapPin, Users, Video } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/Badge';
import type { Event } from '@/shared/types';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const typeLabels: Record<Event['event_type'], string> = {
  hackathon: 'Hackathon',
  talk: 'Charla',
  workshop: 'Taller',
  tournament: 'Torneo',
  social: 'Social',
  academic: 'Académico',
};

const typeVariants: Record<Event['event_type'], 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  hackathon: 'danger',
  talk: 'info',
  workshop: 'success',
  tournament: 'warning',
  social: 'default',
  academic: 'info',
};

export function EventCard({ event, onClick }: EventCardProps) {
  const startDate = new Date(event.start_date);
  const isEventPast = isPast(startDate);

  return (
    <article
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-xl border transition-shadow hover:shadow-md ${
        isEventPast
          ? 'border-gray-200 opacity-60 dark:border-gray-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Date block */}
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900">
          <span className="text-xs font-medium uppercase text-primary-600 dark:text-primary-300">
            {format(startDate, 'MMM', { locale: es })}
          </span>
          <span className="text-xl font-bold text-primary-700 dark:text-primary-200">
            {format(startDate, 'd')}
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={typeVariants[event.event_type]}>
              {typeLabels[event.event_type]}
            </Badge>
            {event.is_virtual && (
              <Badge variant="info">
                <Video className="h-3 w-3" />
                <span className="ml-0.5">Virtual</span>
              </Badge>
            )}
            {event.is_pinned && <Badge variant="pinned">Fijado</Badge>}
            {isEventPast && <Badge variant="default">Finalizado</Badge>}
          </div>

          <h3 className="mt-1.5 truncate text-base font-semibold text-gray-900 dark:text-gray-100">
            {event.title}
          </h3>

          <p className="mt-0.5 line-clamp-1 text-sm text-gray-600 dark:text-gray-300">
            {event.description}
          </p>

          {/* Meta */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(startDate, "d MMM, HH:mm", { locale: es })}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>
                {event.current_attendees}
                {event.max_attendees ? `/${event.max_attendees}` : ''} asistentes
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
