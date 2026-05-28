import { useCallback, useEffect, useRef, useState } from 'react';
import type { InfiniteListProps } from '@/shared/types/ui';
import { EmptyState } from './EmptyState';
import { Skeleton } from './Skeleton';

export function InfiniteList<T extends { id: string }>({
  queryKey: _queryKey,
  queryFn,
  renderItem,
  emptyState,
  skeleton,
}: InfiniteListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(
    async (pageNum: number, isInitial = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
        } else {
          setIsFetchingNext(true);
        }

        const response = await queryFn(pageNum);
        setItems((prev) => {
          if (isInitial) return response.data;
          // Deduplicate items across pages
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = response.data.filter((item) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        setHasMore(response.hasMore);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error al cargar datos'));
      } finally {
        setIsLoading(false);
        setIsFetchingNext(false);
      }
    },
    [queryFn]
  );

  // Initial fetch
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isFetchingNext && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPage(nextPage);
        }
      },
      { rootMargin: '200px' }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, isFetchingNext, isLoading, page, fetchPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Cargando contenido">
        {skeleton || (
          <>
            <Skeleton variant="rectangular" height={120} className="w-full" />
            <Skeleton variant="rectangular" height={120} className="w-full" />
            <Skeleton variant="rectangular" height={120} className="w-full" />
          </>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        title="Error al cargar"
        description={error.message}
      />
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <>
        {emptyState || (
          <EmptyState
            title="No hay resultados"
            description="No se encontraron elementos que coincidan con tu búsqueda."
          />
        )}
      </>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id}>{renderItem(item)}</div>
        ))}
      </div>

      {/* Sentinel for intersection observer */}
      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {/* Loading more indicator */}
      {isFetchingNext && (
        <div className="space-y-4 py-4" aria-busy="true" aria-label="Cargando más">
          {skeleton || (
            <>
              <Skeleton variant="rectangular" height={80} className="w-full" />
              <Skeleton variant="rectangular" height={80} className="w-full" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
