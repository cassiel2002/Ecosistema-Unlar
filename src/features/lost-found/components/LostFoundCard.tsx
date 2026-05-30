import { MapPin, Calendar, Search, Eye } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import type { LostFoundItem } from '@/shared/types';

interface LostFoundCardProps {
  item: LostFoundItem;
  onClick?: () => void;
}

const categoryLabels: Record<LostFoundItem['category'], string> = {
  electronics: 'Electrónica',
  documents: 'Documentos',
  clothing: 'Ropa',
  keys: 'Llaves',
  other: 'Otros',
};

export function LostFoundCard({ item, onClick }: LostFoundCardProps) {
  const timeAgo = formatDistanceToNow(new Date(item.created_at), {
    addSuffix: true,
    locale: es,
  });

  const thumbnail = item.image_urls[0];

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md dark:border-gray-700"
    >
      <div className="flex gap-3 p-4">
        {/* Thumbnail */}
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={item.title}
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            {item.item_type === 'lost' ? (
              <Search className="h-8 w-8 text-gray-300" />
            ) : (
              <Eye className="h-8 w-8 text-gray-300" />
            )}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={item.item_type === 'lost' ? 'danger' : 'info'}>
              {item.item_type === 'lost' ? 'Perdido' : 'Encontrado'}
            </Badge>
            <Badge variant="default">{categoryLabels[item.category]}</Badge>
            {item.is_resolved && <Badge variant="resolved">Resuelto</Badge>}
            {item.is_pinned && <Badge variant="pinned">Fijado</Badge>}
          </div>

          <h3 className="mt-1.5 truncate text-base font-semibold text-gray-900 dark:text-gray-100">
            {item.title}
          </h3>

          <p className="mt-0.5 line-clamp-1 text-sm text-gray-600 dark:text-gray-300">
            {item.description}
          </p>

          {/* Meta */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{item.location_found}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(item.date_found), "d MMM yyyy", { locale: es })}</span>
            </div>
            {item.author && (
              <div className="flex items-center gap-1">
                <Avatar src={item.author.avatar_url} name={item.author.full_name} size="xs" />
                <span>{item.author.full_name}</span>
              </div>
            )}
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
