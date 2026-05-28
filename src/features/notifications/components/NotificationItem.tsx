import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  MessageSquare,
  Reply,
  Heart,
  CheckCircle,
  Megaphone,
  Calendar,
} from 'lucide-react';
import type { Notification } from '@/shared/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const typeConfig: Record<
  Notification['type'],
  { icon: React.ElementType; color: string }
> = {
  comment: { icon: MessageSquare, color: 'text-blue-500' },
  reply: { icon: Reply, color: 'text-purple-500' },
  favorite: { icon: Heart, color: 'text-pink-500' },
  report_resolved: { icon: CheckCircle, color: 'text-green-500' },
  announcement: { icon: Megaphone, color: 'text-red-500' },
  event_reminder: { icon: Calendar, color: 'text-orange-500' },
};

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const navigate = useNavigate();
  const config = typeConfig[notification.type] ?? typeConfig.comment;
  const Icon = config.icon;

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: es,
  });

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-lg transition-colors ${
        notification.is_read
          ? 'bg-white dark:bg-gray-800'
          : 'bg-primary-50 dark:bg-primary-900/20'
      } hover:bg-gray-50 dark:hover:bg-gray-700`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${config.color}`}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${
          notification.is_read
            ? 'text-gray-700 dark:text-gray-300'
            : 'text-gray-900 dark:text-gray-100 font-medium'
        }`}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {notification.body}
        </p>
        <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {timeAgo}
        </span>
      </div>

      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="flex-shrink-0 mt-2">
          <div className="h-2 w-2 rounded-full bg-primary-500" />
        </div>
      )}
    </button>
  );
}
