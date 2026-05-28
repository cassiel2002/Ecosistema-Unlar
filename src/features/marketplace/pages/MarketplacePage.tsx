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
import { MarketplaceCard } from '../components/MarketplaceCard';
import type { MarketplaceItem } from '@/shared/types';
import type { FilterConfig } from '@/shared/types/ui';

const marketplaceFilters: FilterConfig[] = [
  {
    key: 'category',
    label: 'Categoría',
    type: 'select',
    options: [
      { value: 'notes', label: '📚 Apuntes, Resúmenes y Copias' },
      { value: 'books', label: '📕 Libros, Manuales y Literatura' },
      { value: 'electronics', label: '💻 Tecnología, Computación y Celulares' },
      { value: 'furniture', label: '🪑 Hogar, Muebles y Decoración' },
      { value: 'bikes', label: '🚲 Deportes, Bicicletas y Fitness' },
      { value: 'other', label: '👕 Ropa, Calzado, Útiles y Otros' },
    ],
  },
  {
    key: 'condition',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'new', label: 'Nuevo' },
      { value: 'like_new', label: 'Como nuevo' },
      { value: 'good', label: 'Buen estado' },
      { value: 'fair', label: 'Usado' },
    ],
  },
  {
    key: 'is_free',
    label: 'Solo gratis',
    type: 'toggle',
  },
];

export function MarketplacePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = { status: 'active' };

    if (activeFilters.category) filters.category = activeFilters.category;
    if (activeFilters.condition) filters.condition = activeFilters.condition;
    if (activeFilters.is_free) filters.is_free = true;

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
    data: items,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings<MarketplaceItem>({
    table: 'marketplace_items',
    filters: buildFilters(),
    search,
    pageSize: 16,
    realtime: true,
  });

  const handleFilterChange = (key: string, value: unknown) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const handleFavorite = async (id: string) => {
    await toggleFavorite('marketplace', id);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Marketplace
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comprá, vendé o regalá entre estudiantes
          </p>
        </div>
        {user && (
          <Button
            onClick={() => navigate('/marketplace/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Publicar artículo
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar artículos..."
        value={search}
        onChange={setSearch}
        debounceMs={300}
      />

      {/* Filters */}
      <FilterBar
        filters={marketplaceFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={260} className="w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No hay artículos disponibles"
          description="No se encontraron artículos con los filtros seleccionados."
        />
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <MarketplaceCard
                  item={item}
                  onFavorite={user ? handleFavorite : undefined}
                  isFavorited={isFavorited('marketplace', item.id)}
                  onClick={() => navigate(`/marketplace/${item.id}`)}
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
