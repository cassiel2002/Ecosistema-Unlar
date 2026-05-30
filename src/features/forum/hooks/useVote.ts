import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';

interface Vote {
  id: string;
  user_id: string;
  post_id: string;
  direction: 'up' | 'down';
}

interface UseVoteReturn {
  getUserVote: (postId: string) => 'up' | 'down' | null;
  vote: (postId: string, direction: 'up' | 'down') => Promise<void>;
  isVoting: boolean;
}

export function useVote(): UseVoteReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ['user-votes', user?.id];

  const { data: userVotes = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('forum_votes')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
      return (data as Vote[]) ?? [];
    },
    enabled: !!user,
  });

  const getUserVote = useCallback(
    (postId: string): 'up' | 'down' | null => {
      const vote = userVotes.find((v) => v.post_id === postId);
      return vote?.direction ?? null;
    },
    [userVotes]
  );

  const voteMutation = useMutation({
    mutationFn: async ({ postId, direction }: { postId: string; direction: 'up' | 'down' }) => {
      if (!user) throw new Error('Debés iniciar sesión para votar');

      const existingVote = userVotes.find((v) => v.post_id === postId);

      if (existingVote) {
        if (existingVote.direction === direction) {
          // Same direction: remove vote (toggle off)
          const { error } = await supabase
            .from('forum_votes')
            .delete()
            .eq('id', existingVote.id);

          if (error) throw new Error(error.message);

          // Update post counts
          const decrementField = direction === 'up' ? 'upvotes' : 'downvotes';
          await supabase.rpc('decrement_vote_count', {
            target_post_id: postId,
            vote_field: decrementField,
          });

          return { action: 'removed' as const, postId, direction };
        } else {
          // Different direction: change vote
          const { error } = await supabase
            .from('forum_votes')
            .update({ direction })
            .eq('id', existingVote.id);

          if (error) throw new Error(error.message);

          // Update post counts: increment new, decrement old
          const oldField = existingVote.direction === 'up' ? 'upvotes' : 'downvotes';
          const newField = direction === 'up' ? 'upvotes' : 'downvotes';

          await supabase.rpc('swap_vote_count', {
            target_post_id: postId,
            decrement_field: oldField,
            increment_field: newField,
          });

          return { action: 'changed' as const, postId, direction };
        }
      } else {
        // No existing vote: create new
        const { error } = await supabase.from('forum_votes').insert({
          user_id: user.id,
          post_id: postId,
          direction,
        });

        if (error) throw new Error(error.message);

        const incrementField = direction === 'up' ? 'upvotes' : 'downvotes';
        await supabase.rpc('increment_vote_count', {
          target_post_id: postId,
          vote_field: incrementField,
        });

        return { action: 'created' as const, postId, direction };
      }
    },
    // Optimistic update
    onMutate: async ({ postId, direction }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousVotes = queryClient.getQueryData<Vote[]>(queryKey);
      const existingVote = userVotes.find((v) => v.post_id === postId);

      if (existingVote) {
        if (existingVote.direction === direction) {
          // Remove vote
          queryClient.setQueryData<Vote[]>(queryKey, (old) =>
            (old ?? []).filter((v) => v.id !== existingVote.id)
          );
        } else {
          // Change direction
          queryClient.setQueryData<Vote[]>(queryKey, (old) =>
            (old ?? []).map((v) =>
              v.id === existingVote.id ? { ...v, direction } : v
            )
          );
        }
      } else {
        // Add new vote
        const optimisticVote: Vote = {
          id: crypto.randomUUID(),
          user_id: user!.id,
          post_id: postId,
          direction,
        };
        queryClient.setQueryData<Vote[]>(queryKey, (old) => [
          ...(old ?? []),
          optimisticVote,
        ]);
      }

      return { previousVotes };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousVotes) {
        queryClient.setQueryData(queryKey, context.previousVotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['listings', 'forum_posts'] });
    },
  });

  const vote = useCallback(
    async (postId: string, direction: 'up' | 'down'): Promise<void> => {
      await voteMutation.mutateAsync({ postId, direction });
    },
    [voteMutation]
  );

  return {
    getUserVote,
    vote,
    isVoting: voteMutation.isPending,
  };
}
