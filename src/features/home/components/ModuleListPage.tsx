import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { supabase } from '@/core/supabase/client';

interface FilterChip {
  label: string;
  value: string;
  filterFn: (item: Record<string, unknown>) => boolean;
}

interface ModuleListPageProps {
  title: string;
  tableName: string;
  mockData: Record<string, unknown>[];
  filters: FilterChip[];
  cardRenderer: (item: Record<string, unknown>) => React.ReactNode;
  createRoute?: string;
}

export function ModuleListPage({
  title,
  tableName,
  mockData,
  filters,
  cardRenderer,
  createRoute,
}: ModuleListPageProps) {
  const [activeFilter, setActiveFilter] = useState('todos');
  const navigate = useNavigate();

  const { data: realData } = useQuery({
    queryKey: ['module-list', tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const displayData = realData && realData.length > 0 ? realData : mockData;

  const activeFilterConfig = filters.find((f) => f.value === activeFilter);
  const filteredData = activeFilterConfig
    ? displayData.filter(activeFilterConfig.filterFn)
    : displayData;

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {createRoute && (
            <button
              onClick={() => navigate(createRoute)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Publicar</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                activeFilter === filter.value
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sin resultados</h3>
                <p className="text-sm text-gray-400 max-w-sm">
                  No hay publicaciones que coincidan con este filtro.
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {filteredData.map((item, index) => (
                  <motion.div
                    key={(item as { id?: string }).id || index}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.98 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {cardRenderer(item)}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
