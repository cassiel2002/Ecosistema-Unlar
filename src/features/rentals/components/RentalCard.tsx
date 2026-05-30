import { MapPin, Heart, Home, Users, DoorOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import type { Rental } from '@/shared/types';

interface RentalCardProps {
  rental: Rental;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
  onClick?: () => void;
}

const typeLabels: Record<Rental['type'], string> = {
  apartment: 'Departamento',
  room: 'Habitación',
  shared: 'Compartido',
};

const typeIcons: Record<Rental['type'], React.ReactNode> = {
  apartment: <Home className="h-3.5 w-3.5" />,
  room: <DoorOpen className="h-3.5 w-3.5" />,
  shared: <Users className="h-3.5 w-3.5" />,
};

export function RentalCard({ rental, onFavorite, isFavorited = false, onClick }: RentalCardProps) {
  const timeAgo = formatDistanceToNow(new Date(rental.created_at), {
    addSuffix: true,
    locale: es,
  });

  const thumbnail = rental.image_urls[0];

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={rental.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-600">
            <Home className="h-10 w-10" />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute left-2 top-2">
          <Badge variant="info">
            {typeIcons[rental.type]}
            <span className="ml-1">{typeLabels[rental.type]}</span>
          </Badge>
        </div>

        {rental.is_pinned && (
          <div className="absolute left-2 top-9">
            <Badge variant="pinned">Fijado</Badge>
          </div>
        )}

        {/* Favorite button */}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavorite(rental.id);
            }}
            className="absolute right-2 top-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
            aria-label={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart
              className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2.5 py-1 backdrop-blur-sm">
          <span className="text-lg font-bold text-white">
            {rental.currency === 'USD' ? 'US$' : '$'}
            {rental.price.toLocaleString('es-AR')}
          </span>
          <span className="text-xs text-gray-300">/mes</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
          {rental.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{rental.neighborhood}</span>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          {rental.author && (
            <div className="flex items-center gap-2">
              <Avatar
                src={rental.author.avatar_url}
                name={rental.author.full_name}
                size="xs"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {rental.author.full_name}
              </span>
            </div>
          )}
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </article>
  );
}
