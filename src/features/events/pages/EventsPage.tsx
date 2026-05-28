import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { FilterBar } from '@/shared/ui/FilterBar';
import { SearchBar } from '@/shared/ui/SearchBar';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useListings } from '@/shared/hooks/useListings';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { EventCard } from '../components/EventCard';
import type { Event } from '@/shared/types';
import type { FilterConfig } from '@/shared/types/ui';

const eventFilters: FilterConfig[] = [
  {
    key: 'event_type',
    label: 'Tipo',
    type: 'select',
    options: [
      { value: 'hackathon', label: 'Hackathon' },
      { value: 'talk', label: 'Charla' },
      { value: 'workshop', label: 'Taller' },
      { value: 'tournament', label: 'Torneo' },
      { value: 'social', label: 'Social' },
      { value: 'academic', label: 'Académico' },
    ],
  },
  {
    key: 'start_date_from',
    label: 'Desde',
    type: 'date',
  },
  {
    key: 'start_date_to',
    label: 'Hasta',
    type: 'date',
  },
  {
    key: 'show_past',
    label: 'Mostrar pasados',
    type: 'toggle',
  },
];

export function EventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = { status: 'active' };

    if (activeFilters.event_type) filters.event_type = activeFilters.event_type;

    // By default, hide past events unless toggle is active
    if (!activeFilters.show_past) {
      filters.start_date = { gte: new Date().toISOString() };
    }

    if (activeFilters.start_date_from) {
      filters.start_date = {
        ...(filters.start_date as object || {}),
        gte: activeFilters.start_date_from,
      };
    }

    if (activeFilters.start_date_to) {
      filters.end_date = { lte: activeFilters.start_date_to };
    }

    return filters;
  }, [activeFilters]);

  const {
    data: events,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings<Event>({
    table: 'events',
    filters: buildFilters(),
    search,
    sortBy: 'start_date',
    sortOrder: 'asc',
    pageSize: 15,
    realtime: true,
  });

  const handleFilterChange = (key: string, value: unknown) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Eventos
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Descubrí eventos, talleres y actividades universitarias
          </p>
        </div>
        {user && (
          <Button
            onClick={() => navigate('/events/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Crear evento
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar eventos..."
        value={search}
        onChange={setSearch}
        debounceMs={300}
      />

      {/* Filters */}
      <FilterBar
        filters={eventFilters}
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
      ) : events.length === 0 ? (
        <EmptyState
          title="No hay eventos próximos"
          description="No se encontraron eventos con los filtros seleccionados."
        />
      ) : (
        <>
          <div className="space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <EventCard
                  event={event}
                  onClick={() => navigate(`/events/${event.id}`)}
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
