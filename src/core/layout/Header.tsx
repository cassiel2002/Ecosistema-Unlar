import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useAppStore } from '@/core/store';
import { supabase } from '@/core/supabase/client';

interface QuickResult {
  id: string;
  title: string;
  type: string;
  route: string;
}

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

export function Header() {
  const { profile, signOut } = useAuth();
  const unreadCount = useAppStore((s) => s.unreadCount);
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QuickResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const tables = Object.keys(moduleRoutes);
      const allResults: QuickResult[] = [];

      const searchPromises = tables.map(async (table) => {
        const { data } = await supabase
          .from(table)
          .select('id, title')
          .eq('status', 'active')
          .ilike('title', `%${query}%`)
          .limit(3);

        if (data) {
          data.forEach((item: { id: string; title: string }) => {
            allResults.push({
              id: item.id,
              title: item.title,
              type: table,
              route: `${moduleRoutes[table]}/${item.id}`,
            });
          });
        }
      });

      await Promise.all(searchPromises);
      setResults(allResults.slice(0, 8));
      setIsSearching(false);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleResultClick = (route: string) => {
    navigate(route);
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 2) {
      navigate(`/buscar?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="md:hidden flex items-center gap-2">
            <img src="/logo.png" alt="UNLAR" className="h-7 w-7 rounded-md" />
            <span className="font-semibold text-white">UNLAR</span>
          </div>

          {/* Desktop search trigger */}
          <div className="hidden md:flex flex-1 max-w-md">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:border-gray-700 transition-all"
            >
              <Search className="h-4 w-4" />
              <span>Buscar en la plataforma...</span>
              <kbd className="ml-auto text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/notificaciones"
              className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800"
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {profile && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/perfil/${profile.id}`}
                  className="flex items-center p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-700"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-900 flex items-center justify-center text-primary-300 text-sm font-medium ring-2 ring-gray-700">
                      {profile.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
            />

            {/* Search panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative mx-auto mt-20 w-full max-w-lg px-4"
            >
              <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search input */}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
                  <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar alquileres, productos, eventos..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => { setQuery(''); setResults([]); }}
                      className="p-1 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </form>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                  {query.length > 0 && query.length < 2 && (
                    <p className="px-4 py-3 text-sm text-gray-500">Escribí al menos 2 caracteres...</p>
                  )}

                  {isSearching && (
                    <div className="px-4 py-3 flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-400">Buscando...</span>
                    </div>
                  )}

                  {!isSearching && query.length >= 2 && results.length === 0 && (
                    <p className="px-4 py-3 text-sm text-gray-500">No se encontraron resultados para "{query}"</p>
                  )}

                  {results.length > 0 && (
                    <div className="py-2">
                      {results.map((result, index) => (
                        <motion.button
                          key={`${result.type}-${result.id}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleResultClick(result.route)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                        >
                          <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{result.title}</p>
                            <p className="text-xs text-gray-500">{moduleLabels[result.type]}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2.5 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Enter para buscar · Esc para cerrar</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
