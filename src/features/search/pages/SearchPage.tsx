import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useSearch } from '@/shared/hooks/useSearch';
import type { SearchResult } from '@/shared/hooks/useSearch';

const ALL_TABLES = [
  'rentals',
  'marketplace_items',
  'forum_posts',
  'events',
  'lost_found_items',
  'services',
  'tutoring_listings',
  'announcements',
];

const MODULE_TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'rentals', label: 'Alquileres' },
  { key: 'marketplace_items', label: 'Marketplace' },
  { key: 'forum_posts', label: 'Foro' },
  { key: 'events', label: 'Eventos' },
  { key: 'lost_found_items', label: 'Perdidos' },
  { key: 'services', label: 'Servicios' },
  { key: 'tutoring_listings', label: 'Clases' },
  { key: 'announcements', label: 'Anuncios' },
];

const moduleRoutes: Record<string, string> = {
  rentals: '/alquileres',
  marketplace_items: '/marketplace',
  forum_posts: '/foro',
  events: '/eventos',
  lost_found_items: '/perdidos',
  services: '/servicios',
  tutoring_listings: '/clases',
  announcements: '/anuncios',
};

const moduleLabels: Record<string, string> = {
  rentals: 'Alquiler',
  marketplace_items: 'Marketplace',
  forum_posts: 'Foro',
  events: 'Evento',
  lost_found_items: 'Perdidos',
  services: 'Servicio',
  tutoring_listings: 'Clases',
  announcements: 'Anuncio',
};

export function SearchPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const tables = activeTab === 'all' ? ALL_TABLES : [activeTab];

  const { query, setQuery, results, isSearching, totalResults } = useSearch({
    tables,
    debounceMs: 300,
    minChars: 2,
  });

  // Group results by module
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const result of results) {
      if (!groups[result.type]) groups[result.type] = [];
      groups[result.type].push(result);
    }
    return groups;
  }, [results]);

  const handleResultClick = (result: SearchResult) => {
    const route = moduleRoutes[result.type];
    if (route) {
      navigate(`${route}/${result.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {/* Search input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en toda la plataforma..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          autoFocus
        />
      </div>

      {/* Module tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {MODULE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {query.length > 0 && query.length < 2 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Escribí al menos 2 caracteres para buscar
        </p>
      )}

      {isSearching && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} className="w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isSearching && query.length >= 2 && results.length === 0 && (
        <EmptyState
          title="Sin resultados"
          description={`No se encontraron resultados para "${query}"`}
        />
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-6">
          {totalResults > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
            </p>
          )}

          {activeTab === 'all' ? (
            // Grouped view
            Object.entries(groupedResults).map(([type, items]) => (
              <div key={type}>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {moduleLabels[type] ?? type}
                </h3>
                <div className="space-y-2">
                  {items.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <SearchResultCard
                        result={result}
                        onClick={() => handleResultClick(result)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Flat view for single module
            <div className="space-y-2">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <SearchResultCard
                    result={result}
                    onClick={() => handleResultClick(result)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultCard({
  result,
  onClick,
}: {
  result: SearchResult;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow"
    >
      {result.image_url && (
        <img
          src={result.image_url}
          alt=""
          className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
          {result.title}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {result.description}
        </p>
        <span className="mt-1 inline-block text-xs text-primary-600 dark:text-primary-400">
          {moduleLabels[result.type] ?? result.type}
        </span>
      </div>
    </button>
  );
}
