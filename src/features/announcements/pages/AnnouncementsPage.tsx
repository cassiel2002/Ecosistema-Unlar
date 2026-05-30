import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilterBar } from '@/shared/ui/FilterBar';
import { SearchBar } from '@/shared/ui/SearchBar';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useListings } from '@/shared/hooks/useListings';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { AnnouncementCard } from '../components/AnnouncementCard';
import type { Announcement } from '@/shared/types';
import type { FilterConfig } from '@/shared/types/ui';

const announcementFilters: FilterConfig[] = [
  {
    key: 'priority',
    label: 'Prioridad',
    type: 'select',
    options: [
      { value: 'urgent', label: 'Urgente' },
      { value: 'important', label: 'Importante' },
      { value: 'normal', label: 'Normal' },
    ],
  },
  {
    key: 'source',
    label: 'Fuente',
    type: 'select',
    options: [
      { value: 'student_center', label: 'Centro de Estudiantes' },
      { value: 'faculty', label: 'Facultad' },
      { value: 'community', label: 'Comunidad' },
    ],
  },
];

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = { status: 'active' };

    if (activeFilters.priority) filters.priority = activeFilters.priority;
    if (activeFilters.source) filters.source = activeFilters.source;

    return filters;
  }, [activeFilters]);

  const {
    data: announcements,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings<Announcement>({
    table: 'announcements',
    filters: buildFilters(),
    search,
    sortBy: 'created_at',
    sortOrder: 'desc',
    pageSize: 20,
    realtime: true,
  });

  // Filter out expired announcements and career-specific ones client-side
  const filteredAnnouncements = useMemo(() => {
    const now = new Date();
    return announcements.filter((announcement) => {
      // Filter out expired
      if (announcement.expires_at && new Date(announcement.expires_at) < now) {
        return false;
      }

      // Filter by career visibility
      if (announcement.target_careers.length > 0 && profile?.career_id) {
        return announcement.target_careers.includes(profile.career_id);
      }

      // Show if no target careers (visible to all) or user has no career set
      return announcement.target_careers.length === 0 || !profile?.career_id;
    });
  }, [announcements, profile?.career_id]);

  const handleFilterChange = (key: string, value: unknown) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Anuncios
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Información importante de la facultad y la comunidad
        </p>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar anuncios..."
        value={search}
        onChange={setSearch}
        debounceMs={300}
      />

      {/* Filters */}
      <FilterBar
        filters={announcementFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={100} className="w-full rounded-xl" />
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState
          title="No hay anuncios"
          description="No se encontraron anuncios con los filtros seleccionados."
        />
      ) : (
        <>
          <div className="space-y-3">
            {filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <AnnouncementCard
                  announcement={announcement}
                  onClick={() => navigate(`/announcements/${announcement.id}`)}
                />
              </motion.div>
            ))}
          </div>

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
