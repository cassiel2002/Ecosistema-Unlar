import { Heart, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import { ReputationBadge } from '@/shared/ui/ReputationBadge';
import type { Service } from '@/shared/types';

interface ServiceCardProps {
  service: Service;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
  onClick?: () => void;
}

const typeLabels: Record<Service['service_type'], string> = {
  design: 'Diseño',
  programming: 'Programación',
  photography: 'Fotografía',
  tutoring: 'Tutoría',
  writing: 'Redacción',
  other: 'Otro',
};

const typeVariants: Record<Service['service_type'], 'info' | 'success' | 'warning' | 'default'> = {
  design: 'info',
  programming: 'success',
  photography: 'warning',
  tutoring: 'info',
  writing: 'default',
  other: 'default',
};

export function ServiceCard({ service, onFavorite, isFavorited = false, onClick }: ServiceCardProps) {
  const timeAgo = formatDistanceToNow(new Date(service.created_at), {
    addSuffix: true,
    locale: es,
  });

  const thumbnail = service.image_urls[0];

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
            alt={service.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-600">
            <Briefcase className="h-10 w-10" />
          </div>
        )}

        {service.is_pinned && (
          <div className="absolute left-2 top-2">
            <Badge variant="pinned">Fijado</Badge>
          </div>
        )}

        {onFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavorite(service.id);
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
          <Badge variant={typeVariants[service.service_type]} size="sm">
            {typeLabels[service.service_type]}
          </Badge>
          {service.price_range && (
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {service.price_range}
            </span>
          )}
        </div>

        <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {service.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
          {service.description}
        </p>

        {/* Footer */}
        <div className="mt-2.5 flex items-center justify-between">
          {service.author && (
            <div className="flex items-center gap-1.5">
              <Avatar
                src={service.author.avatar_url}
                name={service.author.full_name}
                size="xs"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {service.author.full_name}
              </span>
              <ReputationBadge score={service.author.reputation_score} size="sm" />
            </div>
          )}
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </article>
  );
}
