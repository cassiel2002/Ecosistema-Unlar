import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { NotificationItem } from '../components/NotificationItem';

export function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Notificaciones
          </h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} sin leer
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={markAllAsRead}
            className="flex items-center gap-1.5"
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} className="w-full rounded-lg" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="Sin notificaciones"
          description="No tenés notificaciones por el momento."
          icon={<Bell className="h-12 w-12 text-gray-300 dark:text-gray-600" />}
        />
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <NotificationItem
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
