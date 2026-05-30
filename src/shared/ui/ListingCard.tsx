import { Heart, Flag, Eye, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ListingCardProps } from '@/shared/types/ui';
import type { BaseListing } from '@/shared/types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

export function ListingCard<T extends BaseListing>({
  listing,
  variant,
  onFavorite,
  onReport,
  isFavorited = false,
  showAuthor = true,
}: ListingCardProps<T>) {
  const timeAgo = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
    locale: es,
  });

  const thumbnail = listing.image_urls[0];

  if (variant === 'compact') {
    return (
      <article className="flex gap-3 rounded-lg border border-gray-200 p-3 transition-shadow hover:shadow-md dark:border-gray-700">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={listing.title}
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {listing.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
            {listing.description}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{timeAgo}</span>
          </div>
        </div>
        {listing.is_pinned && <Badge variant="pinned">Fijado</Badge>}
      </article>
    );
  }

  if (variant === 'grid') {
    return (
      <article className="group overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-600">
              <Eye className="h-8 w-8" />
            </div>
          )}
          {listing.is_pinned && (
            <div className="absolute left-2 top-2">
              <Badge variant="pinned">Fijado</Badge>
            </div>
          )}
          {/* Favorite button */}
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
        <div className="p-4">
          <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
            {listing.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {listing.description}
          </p>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            {showAuthor && listing.author && (
              <div className="flex items-center gap-2">
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

  // Full variant
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        {thumbnail && (
          <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-48">
            <img
              src={thumbnail}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
            {listing.is_pinned && (
              <div className="absolute left-2 top-2">
                <Badge variant="pinned">Fijado</Badge>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {listing.title}
            </h3>
            <div className="flex shrink-0 gap-1">
              {onFavorite && (
                <button
                  onClick={() => onFavorite(listing.id)}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              )}
              {onReport && (
                <button
                  onClick={() => onReport(listing.id)}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Reportar publicación"
                >
                  <Flag className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <p className="mt-1 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
            {listing.description}
          </p>

          {/* Meta */}
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 text-xs text-gray-500 dark:text-gray-400">
            {showAuthor && listing.author && (
              <div className="flex items-center gap-1.5">
                <Avatar
                  src={listing.author.avatar_url}
                  name={listing.author.full_name}
                  size="xs"
                />
                <span>{listing.author.full_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{listing.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{listing.favorite_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
