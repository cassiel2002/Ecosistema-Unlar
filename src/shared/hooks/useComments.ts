import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { Comment } from '@/shared/types';

export interface UseCommentsOptions {
  targetType: string;
  targetId: string;
}

export interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  addComment: (content: string, parentId?: string | null) => Promise<void>;
  upvoteComment: (commentId: string) => Promise<void>;
  isAdding: boolean;
}

export function useComments({ targetType, targetId }: UseCommentsOptions): UseCommentsReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ['comments', targetType, targetId];

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*, author:user_profiles!author_id(*)')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: true });

      if (fetchError) throw new Error(fetchError.message);
      return (data as Comment[]) ?? [];
    },
    enabled: !!targetId,
  });

  const addMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string | null }) => {
      if (!user) throw new Error('Debés iniciar sesión para comentar');

      const { data, error: insertError } = await supabase
        .from('comments')
        .insert({
          author_id: user.id,
          target_type: targetType,
          target_id: targetId,
          parent_id: parentId ?? null,
          content,
          upvotes: 0,
        })
        .select('*, author:user_profiles!author_id(*)')
        .single();

      if (insertError) throw new Error(insertError.message);
      return data as Comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) throw new Error('Debés iniciar sesión para votar');

      // Check if already upvoted
      const { data: existing } = await supabase
        .from('comment_upvotes')
        .select('id')
        .eq('user_id', user.id)
        .eq('comment_id', commentId)
        .single();

      if (existing) {
        // Remove upvote
        await supabase
          .from('comment_upvotes')
          .delete()
          .eq('id', existing.id);

        await supabase.rpc('decrement_comment_upvotes', { target_comment_id: commentId });
      } else {
        // Add upvote
        await supabase.from('comment_upvotes').insert({
          user_id: user.id,
          comment_id: commentId,
        });

        await supabase.rpc('increment_comment_upvotes', { target_comment_id: commentId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const addComment = useCallback(
    async (content: string, parentId?: string | null): Promise<void> => {
      await addMutation.mutateAsync({ content, parentId });
    },
    [addMutation]
  );

  const upvoteComment = useCallback(
    async (commentId: string): Promise<void> => {
      await upvoteMutation.mutateAsync(commentId);
    },
    [upvoteMutation]
  );

  return {
    comments,
    isLoading,
    error: error as Error | null,
    addComment,
    upvoteComment,
    isAdding: addMutation.isPending,
  };
}
