import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Video } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Event } from '@/shared/types';

interface EventPreviewCardProps {
  event: Partial<Event>;
}

const typeLabels: Record<string, string> = {
  hackathon: 'Hackathon',
  talk: 'Charla',
  workshop: 'Taller',
  tournament: 'Torneo',
  social: 'Social',
  academic: 'Académico',
};

const typeColors: Record<string, string> = {
  hackathon: 'bg-violet-600/20 text-violet-400',
  talk: 'bg-blue-600/20 text-blue-400',
  workshop: 'bg-amber-600/20 text-amber-400',
  tournament: 'bg-emerald-600/20 text-emerald-400',
  social: 'bg-pink-600/20 text-pink-400',
  academic: 'bg-cyan-600/20 text-cyan-400',
};

export function EventPreviewCard({ event }: EventPreviewCardProps) {
  const startDate = event.start_date ? new Date(event.start_date) : null;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-gray-700"
    >
      {/* Image */}
      {event.image_urls && event.image_urls[0] && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={event.image_urls[0]}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Date overlay */}
          {startDate && (
            <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center">
              <span className="block text-xs font-bold text-primary-400 uppercase">
                {format(startDate, 'MMM', { locale: es })}
              </span>
              <span className="block text-lg font-bold text-white leading-tight">
                {format(startDate, 'd')}
              </span>
            </div>
          )}
          {event.event_type && (
            <div className="absolute top-3 right-3">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-lg backdrop-blur-sm ${typeColors[event.event_type] || 'bg-gray-800 text-gray-400'}`}>
                {typeLabels[event.event_type]}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
          {event.title}
        </h3>

        <div className="space-y-1.5">
          {startDate && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{format(startDate, "EEEE d 'de' MMMM, HH:mm'hs'", { locale: es })}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.is_virtual && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Video className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Virtual disponible</span>
            </div>
          )}
        </div>

        {/* Attendees */}
        {event.max_attendees && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5" />
            <span>{event.current_attendees || 0}/{event.max_attendees} inscriptos</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden ml-1">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${Math.min(((event.current_attendees || 0) / event.max_attendees) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
