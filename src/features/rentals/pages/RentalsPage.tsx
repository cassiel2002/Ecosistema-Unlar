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
import { RentalCard } from '../components/RentalCard';
import type { Rental } from '@/shared/types';
import type { FilterConfig } from '@/shared/types/ui';

const rentalFilters: FilterConfig[] = [
  {
    key: 'type',
    label: 'Tipo',
    type: 'select',
    options: [
      { value: 'apartment', label: 'Departamento' },
      { value: 'room', label: 'Habitación' },
      { value: 'shared', label: 'Compartido' },
    ],
  },
  {
    key: 'price',
    label: 'Precio',
    type: 'range',
    min: 0,
    max: 500000,
  },
  {
    key: 'neighborhood',
    label: 'Barrio',
    type: 'search',
  },
  {
    key: 'allows_pets',
    label: 'Acepta mascotas',
    type: 'toggle',
  },
  {
    key: 'gender_preference',
    label: 'Preferencia',
    type: 'select',
    options: [
      { value: 'any', label: 'Sin preferencia' },
      { value: 'male', label: 'Masculino' },
      { value: 'female', label: 'Femenino' },
    ],
  },
];

export function RentalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = { status: 'active' };

    if (activeFilters.type) filters.type = activeFilters.type;
    if (activeFilters.allows_pets) filters.allows_pets = true;
    if (activeFilters.gender_preference) filters.gender_preference = activeFilters.gender_preference;
    if (activeFilters.neighborhood) filters.neighborhood = activeFilters.neighborhood;

    const priceRange = activeFilters.price as { min?: number; max?: number } | undefined;
    if (priceRange?.min || priceRange?.max) {
      filters.price = {
        ...(priceRange.min ? { gte: priceRange.min } : {}),
        ...(priceRange.max ? { lte: priceRange.max } : {}),
      };
    }

    return filters;
  }, [activeFilters]);

  const {
    data: rentals,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings<Rental>({
    table: 'rentals',
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
    await toggleFavorite('rental', id);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Alquileres
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Encontrá tu próximo hogar cerca de la universidad
          </p>
        </div>
        {user && (
          <Button
            onClick={() => navigate('/rentals/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Publicar alquiler
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar alquileres..."
        value={search}
        onChange={setSearch}
        debounceMs={300}
      />

      {/* Filters */}
      <FilterBar
        filters={rentalFilters}
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
      ) : rentals.length === 0 ? (
        <EmptyState
          title="No hay alquileres disponibles"
          description="No se encontraron alquileres con los filtros seleccionados."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rentals.map((rental, index) => (
              <motion.div
                key={rental.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RentalCard
                  rental={rental}
                  onFavorite={user ? handleFavorite : undefined}
                  isFavorited={isFavorited('rental', rental.id)}
                  onClick={() => navigate(`/rentals/${rental.id}`)}
                />
              </motion.div>
            ))}
          </div>

          {/* Load more */}
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
