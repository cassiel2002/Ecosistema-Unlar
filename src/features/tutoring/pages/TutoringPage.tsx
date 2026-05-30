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
import { useFavorites } from '@/shared/hooks/useFavorites';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { TutoringCard } from '../components/TutoringCard';
import type { TutoringListing } from '@/shared/types';
import type { FilterConfig } from '@/shared/types/ui';

const tutoringFilters: FilterConfig[] = [
  {
    key: 'modality',
    label: 'Modalidad',
    type: 'select',
    options: [
      { value: 'in_person', label: 'Presencial' },
      { value: 'virtual', label: 'Virtual' },
      { value: 'both', label: 'Ambas' },
    ],
  },
  {
    key: 'price_per_hour',
    label: 'Precio por hora',
    type: 'range',
    min: 0,
    max: 50000,
  },
];

export function TutoringPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = { status: 'active' };

    if (activeFilters.modality) filters.modality = activeFilters.modality;
    if (activeFilters.career_id) filters.career_id = activeFilters.career_id;

    const priceRange = activeFilters.price_per_hour as { min?: number; max?: number } | undefined;
    if (priceRange?.min || priceRange?.max) {
      filters.price_per_hour = {
        ...(priceRange.min ? { gte: priceRange.min } : {}),
        ...(priceRange.max ? { lte: priceRange.max } : {}),
      };
    }

    return filters;
  }, [activeFilters]);

  const {
    data: listings,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings<TutoringListing>({
    table: 'tutoring_listings',
    filters: buildFilters(),
    search,
    pageSize: 12,
    realtime: true,
  });

  const handleFilterChange = (key: string, value: unknown) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const handleFavorite = async (id: string) => {
    await toggleFavorite('tutoring', id);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Clases Particulares
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Encontrá tutores o ofrecé clases en tu materia
          </p>
        </div>
        {user && (
          <Button
            onClick={() => navigate('/tutoring/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Ofrecer clases
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar por materia, tema o tutor..."
        value={search}
        onChange={setSearch}
        debounceMs={300}
      />

      {/* Filters */}
      <FilterBar
        filters={tutoringFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={280} className="w-full rounded-xl" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          title="No hay clases disponibles"
          description="No se encontraron clases con los filtros seleccionados."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <TutoringCard
                  listing={listing}
                  onFavorite={user ? handleFavorite : undefined}
                  isFavorited={isFavorited('tutoring', listing.id)}
                  onClick={() => navigate(`/tutoring/${listing.id}`)}
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
