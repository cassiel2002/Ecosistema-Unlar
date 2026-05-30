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
import { ServiceCard } from '../components/ServiceCard';
import type { Service } from '@/shared/types';
import type { FilterConfig } from '@/shared/types/ui';

const serviceFilters: FilterConfig[] = [
  {
    key: 'service_type',
    label: 'Tipo de servicio',
    type: 'select',
    options: [
      { value: 'design', label: 'Diseño' },
      { value: 'programming', label: 'Programación' },
      { value: 'photography', label: 'Fotografía' },
      { value: 'tutoring', label: 'Tutoría' },
      { value: 'writing', label: 'Redacción' },
      { value: 'other', label: 'Otro' },
    ],
  },
  {
    key: 'availability',
    label: 'Disponibilidad',
    type: 'select',
    options: [
      { value: 'full_time', label: 'Tiempo completo' },
      { value: 'part_time', label: 'Medio tiempo' },
      { value: 'weekends', label: 'Fines de semana' },
      { value: 'flexible', label: 'Flexible' },
    ],
  },
];

export function ServicesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = { status: 'active' };

    if (activeFilters.service_type) filters.service_type = activeFilters.service_type;
    if (activeFilters.availability) filters.availability = activeFilters.availability;

    return filters;
  }, [activeFilters]);

  const {
    data: services,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings<Service>({
    table: 'services',
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
    await toggleFavorite('service', id);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Servicios
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Encontrá servicios profesionales ofrecidos por estudiantes
          </p>
        </div>
        {user && (
          <Button
            onClick={() => navigate('/services/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Ofrecer servicio
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar servicios..."
        value={search}
        onChange={setSearch}
        debounceMs={300}
      />

      {/* Filters */}
      <FilterBar
        filters={serviceFilters}
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
      ) : services.length === 0 ? (
        <EmptyState
          title="No hay servicios disponibles"
          description="No se encontraron servicios con los filtros seleccionados."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ServiceCard
                  service={service}
                  onFavorite={user ? handleFavorite : undefined}
                  isFavorited={isFavorited('service', service.id)}
                  onClick={() => navigate(`/services/${service.id}`)}
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
