import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Home,
  ShoppingBag,
  MessageSquare,
  Calendar,
  Search,
  Briefcase,
  GraduationCap,
  Megaphone,
  Eye,
  Heart,
  Pin,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { FeedItem } from '@/shared/types';

interface FeedCardProps {
  item: FeedItem;
}

const moduleConfig: Record<
  FeedItem['module'],
  { label: string; icon: React.ElementType; color: string; route: string }
> = {
  rental: { label: 'Alquiler', icon: Home, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', route: '/alquileres' },
  marketplace: { label: 'Marketplace', icon: ShoppingBag, color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', route: '/marketplace' },
  forum: { label: 'Foro', icon: MessageSquare, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300', route: '/foro' },
  event: { label: 'Evento', icon: Calendar, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300', route: '/eventos' },
  lost_found: { label: 'Perdidos', icon: Search, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', route: '/perdidos' },
  service: { label: 'Servicio', icon: Briefcase, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300', route: '/servicios' },
  tutoring: { label: 'Clases', icon: GraduationCap, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300', route: '/clases' },
  announcement: { label: 'Anuncio', icon: Megaphone, color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', route: '/anuncios' },
};

export function FeedCard({ item }: FeedCardProps) {
  const navigate = useNavigate();
  const config = moduleConfig[item.module];
  const Icon = config.icon;

  const timeAgo = formatDistanceToNow(new Date(item.created_at), {
    addSuffix: true,
    locale: es,
  });

  const handleClick = () => {
    navigate(`${config.route}/${item.id}`);
  };

  return (
    <article
      onClick={handleClick}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-start gap-3">
        {/* Module icon */}
        <div className={`flex-shrink-0 rounded-lg p-2 ${config.color}`}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {config.label}
            </span>
            {item.is_pinned && (
              <Badge variant="pinned" size="sm">
                <Pin className="h-3 w-3 mr-0.5" />
                Fijado
              </Badge>
            )}
            {item.module === 'announcement' && item.priority === 'urgent' && (
              <Badge variant="danger" size="sm">Urgente</Badge>
            )}
            {item.module === 'announcement' && item.priority === 'important' && (
              <Badge variant="warning" size="sm">Importante</Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>

          {/* Image preview */}
          {item.image_urls && item.image_urls.length > 0 && (
            <div className="mt-2">
              <img
                src={item.image_urls[0]}
                alt=""
                className="h-32 w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* Footer */}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            <span>{timeAgo}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {item.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {item.favorite_count}
            </span>
            {item.comment_count !== undefined && item.comment_count > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {item.comment_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
