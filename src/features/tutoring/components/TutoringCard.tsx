import { Heart, GraduationCap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import type { TutoringListing } from '@/shared/types';

interface TutoringCardProps {
  listing: TutoringListing;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
  onClick?: () => void;
}

const modalityLabels: Record<TutoringListing['modality'], string> = {
  in_person: 'Presencial',
  virtual: 'Virtual',
  both: 'Presencial / Virtual',
};

const modalityVariants: Record<TutoringListing['modality'], 'info' | 'success' | 'warning'> = {
  in_person: 'info',
  virtual: 'success',
  both: 'warning',
};

export function TutoringCard({ listing, onFavorite, isFavorited = false, onClick }: TutoringCardProps) {
  const timeAgo = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
    locale: es,
  });

  const thumbnail = listing.image_urls[0];

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-600">
            <GraduationCap className="h-10 w-10" />
          </div>
        )}

        {listing.is_pinned && (
          <div className="absolute left-2 top-2">
            <Badge variant="pinned">Fijado</Badge>
          </div>
        )}

        {onFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavorite(listing.id);
            }}
            className="absolute right-2 top-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
            aria-label={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart
              className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="mb-1 flex items-center gap-2">
          <Badge variant={modalityVariants[listing.modality]} size="sm">
            {modalityLabels[listing.modality]}
          </Badge>
        </div>

        <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {listing.title}
        </h3>

        <p className="mt-0.5 text-xs font-medium text-primary-600 dark:text-primary-400">
          {listing.subject}
        </p>

        {/* Price */}
        <div className="mt-1.5">
          {listing.price_per_hour ? (
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              ${listing.price_per_hour.toLocaleString('es-AR')}/hora
            </span>
          ) : (
            <span className="text-sm font-bold text-secondary-600 dark:text-secondary-400">
              A convenir
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-2.5 flex items-center justify-between">
          {listing.author && (
            <div className="flex items-center gap-1.5">
              <Avatar
                src={listing.author.avatar_url}
                name={listing.author.full_name}
                size="xs"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {listing.author.full_name}
              </span>
            </div>
          )}
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </article>
  );
}
