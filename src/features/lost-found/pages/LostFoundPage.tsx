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
import { LostFoundCard } from '../components/LostFoundCard';
import type { LostFoundItem } from '@/shared/types';
import type { FilterConfig } from '@/shared/types/ui';

const lostFoundFilters: FilterConfig[] = [
  {
    key: 'item_type',
    label: 'Tipo',
    type: 'select',
    options: [
      { value: 'lost', label: 'Perdido' },
      { value: 'found', label: 'Encontrado' },
    ],
  },
  {
    key: 'category',
    label: 'Categoría',
    type: 'select',
    options: [
      { value: 'electronics', label: 'Electrónica' },
      { value: 'documents', label: 'Documentos' },
      { value: 'clothing', label: 'Ropa' },
      { value: 'keys', label: 'Llaves' },
      { value: 'other', label: 'Otros' },
    ],
  },
  {
    key: 'is_resolved',
    label: 'Mostrar resueltos',
    type: 'toggle',
  },
];

export function LostFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = { status: 'active' };

    if (activeFilters.item_type) filters.item_type = activeFilters.item_type;
    if (activeFilters.category) filters.category = activeFilters.category;
    // By default, hide resolved items unless toggle is active
    if (!activeFilters.is_resolved) filters.is_resolved = false;

    return filters;
  }, [activeFilters]);

  const {
    data: items,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings<LostFoundItem>({
    table: 'lost_found_items',
    filters: buildFilters(),
    search,
    sortBy: 'created_at',
    sortOrder: 'desc',
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
            Perdidos y Encontrados
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Reportá objetos perdidos o encontrados en la universidad
          </p>
        </div>
        {user && (
          <Button
            onClick={() => navigate('/lost-found/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Reportar
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar objetos..."
        value={search}
        onChange={setSearch}
        debounceMs={300}
      />

      {/* Filters */}
      <FilterBar
        filters={lostFoundFilters}
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
      ) : items.length === 0 ? (
        <EmptyState
          title="No hay reportes"
          description="No se encontraron objetos con los filtros seleccionados."
        />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <LostFoundCard
                  item={item}
                  onClick={() => navigate(`/lost-found/${item.id}`)}
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
