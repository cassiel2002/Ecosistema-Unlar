import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';
import { useFeed } from '../hooks/useFeed';
import { FeedCard } from '../components/FeedCard';

export function FeedPage() {
  const {
    items,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useFeed();

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Inicio
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Lo más reciente de tu comunidad universitaria
        </p>
      </div>

      {/* Feed content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={140} className="w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Sin novedades"
          description="No hay publicaciones recientes. ¡Sé el primero en publicar algo!"
        />
      ) : (
        <>
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  layout
                >
                  <FeedCard item={item} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Cargar más
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
