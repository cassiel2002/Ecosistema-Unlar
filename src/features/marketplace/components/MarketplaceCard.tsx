import { Heart, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import type { MarketplaceItem } from '@/shared/types';

interface MarketplaceCardProps {
  item: MarketplaceItem;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
  onClick?: () => void;
}

const categoryLabels: Record<MarketplaceItem['category'], string> = {
  notes: 'Apuntes y Resúmenes',
  electronics: 'Electrónica y Tecnología',
  furniture: 'Muebles y Equipamiento',
  books: 'Libros y Manuales',
  bikes: 'Bicis y Transporte',
  other: 'Indumentaria, Útiles y Otros',
};

const conditionLabels: Record<MarketplaceItem['condition'], string> = {
  new: 'Nuevo',
  like_new: 'Como nuevo',
  good: 'Buen estado',
  fair: 'Usado',
};

export function MarketplaceCard({ item, onFavorite, isFavorited = false, onClick }: MarketplaceCardProps) {
  const timeAgo = formatDistanceToNow(new Date(item.created_at), {
    addSuffix: true,
    locale: es,
  });

  const thumbnail = item.image_urls[0];

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-600">
            <Tag className="h-10 w-10" />
          </div>
        )}

        {/* Free badge */}
        {item.is_free && (
          <div className="absolute left-2 top-2">
            <Badge variant="free" size="md">Gratis</Badge>
          </div>
        )}

        {item.is_pinned && !item.is_free && (
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
              onFavorite(item.id);
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
        {/* Price */}
        <div className="mb-1">
          {item.is_free ? (
            <span className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
              Gratis
            </span>
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ${item.price?.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {item.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-2">
          <Badge variant="default" size="sm">{categoryLabels[item.category]}</Badge>
          <Badge variant="info" size="sm">{conditionLabels[item.condition]}</Badge>
        </div>

        {/* Footer */}
        <div className="mt-2.5 flex items-center justify-between">
          {item.author && (
            <div className="flex items-center gap-1.5">
              <Avatar
                src={item.author.avatar_url}
                name={item.author.full_name}
                size="xs"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.author.full_name}
              </span>
            </div>
          )}
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </article>
  );
}
