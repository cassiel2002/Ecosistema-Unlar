import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';

interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  joined_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
}

export function useCommunity(communityId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);

  // Check membership
  const { data: membership, isLoading: isCheckingMembership } = useQuery({
    queryKey: ['community-membership', communityId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user && !!communityId,
  });

  const isMember = !!membership;

  // Fetch members
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['community-members', communityId],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('community_members')
        .select('*, user:user_profiles!user_id(id, full_name, avatar_url, is_verified)')
        .eq('community_id', communityId)
        .order('joined_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);
      return (data as CommunityMember[]) ?? [];
    },
    enabled: !!communityId,
  });

  // Join community
  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Debés iniciar sesión para unirte');

      const { error: joinError } = await supabase
        .from('community_members')
        .insert({ community_id: communityId, user_id: user.id });

      if (joinError) {
        if (joinError.code === '23505') {
          throw new Error('Ya sos miembro de esta comunidad');
        }
        throw new Error(joinError.message);
      }

      // Update member count
      await supabase.rpc('increment_member_count', { community_id_param: communityId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-membership', communityId] });
      queryClient.invalidateQueries({ queryKey: ['community-members', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (err: Error) => setError(err),
  });

  // Leave community
  const leaveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Debés iniciar sesión');

      const { error: leaveError } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', user.id);

      if (leaveError) throw new Error(leaveError.message);

      // Decrement member count
      await supabase.rpc('decrement_member_count', { community_id_param: communityId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-membership', communityId] });
      queryClient.invalidateQueries({ queryKey: ['community-members', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (err: Error) => setError(err),
  });

  const join = useCallback(() => joinMutation.mutateAsync(), [joinMutation]);
  const leave = useCallback(() => leaveMutation.mutateAsync(), [leaveMutation]);

  return {
    isMember,
    isCheckingMembership,
    members,
    isLoadingMembers,
    memberCount: members.length,
    join,
    leave,
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
    error,
  };
}
