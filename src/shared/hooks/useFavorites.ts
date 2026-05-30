import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { Favorite } from '@/shared/types';

export interface UseFavoritesReturn {
  favorites: Favorite[];
  isFavorited: (targetType: string, targetId: string) => boolean;
  toggleFavorite: (targetType: string, targetId: string) => Promise<void>;
  favoritesCount: number;
  isLoading: boolean;
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ['favorites', user?.id];

  const { data: favorites = [], isLoading } = useQuery({
    queryKey,
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

  const isFavorited = useCallback(
    (targetType: string, targetId: string): boolean => {
      return favorites.some(
        (fav) => fav.target_type === targetType && fav.target_id === targetId
      );
    },
    [favorites]
  );

  const toggleMutation = useMutation({
    mutationFn: async ({
      targetType,
      targetId,
    }: {
      targetType: string;
      targetId: string;
    }) => {
      if (!user) throw new Error('User must be authenticated');

      const existing = favorites.find(
        (fav) => fav.target_type === targetType && fav.target_id === targetId
      );

      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);

        if (error) throw new Error(error.message);

        // Decrement favorite_count on the target listing
        await supabase.rpc('decrement_favorite_count', {
          target_table: targetType,
          target_row_id: targetId,
        });

        return { action: 'removed' as const, targetType, targetId };
      } else {
        // Add favorite
        const { error } = await supabase.from('favorites').insert({
          user_id: user.id,
          target_type: targetType,
          target_id: targetId,
        });

        if (error) throw new Error(error.message);

        // Increment favorite_count on the target listing
        await supabase.rpc('increment_favorite_count', {
          target_table: targetType,
          target_row_id: targetId,
        });

        return { action: 'added' as const, targetType, targetId };
      }
    },
    // Optimistic update
    onMutate: async ({ targetType, targetId }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousFavorites = queryClient.getQueryData<Favorite[]>(queryKey);

      const existing = favorites.find(
        (fav) => fav.target_type === targetType && fav.target_id === targetId
      );

      if (existing) {
        // Optimistically remove
        queryClient.setQueryData<Favorite[]>(queryKey, (old) =>
          (old ?? []).filter((fav) => fav.id !== existing.id)
        );
      } else {
        // Optimistically add
        const optimisticFavorite: Favorite = {
          id: crypto.randomUUID(),
          user_id: user!.id,
          target_type: targetType,
          target_id: targetId,
          created_at: new Date().toISOString(),
        };
        queryClient.setQueryData<Favorite[]>(queryKey, (old) => [
          optimisticFavorite,
          ...(old ?? []),
        ]);
      }

      return { previousFavorites };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const toggleFavorite = useCallback(
    async (targetType: string, targetId: string): Promise<void> => {
      await toggleMutation.mutateAsync({ targetType, targetId });
    },
    [toggleMutation]
  );

  return {
    favorites,
    isFavorited,
    toggleFavorite,
    favoritesCount: favorites.length,
    isLoading,
  };
}
