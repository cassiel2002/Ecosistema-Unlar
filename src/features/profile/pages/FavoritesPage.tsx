import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Badge } from '@/shared/ui/Badge';
import type { Favorite } from '@/shared/types';



const typeLabels: Record<string, string> = {
  rental: 'Alquiler',
  marketplace: 'Marketplace',
  event: 'Evento',
  service: 'Servicio',
  tutoring: 'Clase particular',
};

const typeRoutes: Record<string, string> = {
  rental: '/rentals',
  marketplace: '/marketplace',
  event: '/events',
  service: '/services',
  tutoring: '/tutoring',
};

export function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return (data as Favorite[]) ?? [];
    },
    enabled: !!user,
  });

  // Group favorites by type
  const groupedFavorites = favorites.reduce<Record<string, Favorite[]>>((acc, fav) => {
    const type = fav.target_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(fav);
    return acc;
  }, {});

  const handleFavoriteClick = (favorite: Favorite) => {
    const route = typeRoutes[favorite.target_type];
    if (route) {
      navigate(`${route}/${favorite.target_id}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate(`/perfil/${user?.id}`)}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al perfil
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Mis Favoritos
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Todas tus publicaciones guardadas
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} className="w-full rounded-lg" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          title="Sin favoritos"
          description="Aún no guardaste ninguna publicación. Usá el botón de corazón para guardar las que te interesen."
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFavorites).map(([type, typeFavorites]) => (
            <div key={type}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <Heart className="h-4 w-4" />
                {typeLabels[type] ?? type} ({typeFavorites.length})
              </h2>
              <div className="space-y-2">
                {typeFavorites.map((favorite, index) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleFavoriteClick(favorite)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm">
                          {typeLabels[type] ?? type}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400">
                        Guardado el {new Date(favorite.created_at).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
