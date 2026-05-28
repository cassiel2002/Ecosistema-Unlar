import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { Report } from '@/shared/types';

interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedToday: number;
  activeListings: number;
}

export interface UseModerationReturn {
  pendingReports: Report[];
  resolveReport: (reportId: string, action: 'dismiss' | 'warn' | 'remove') => Promise<void>;
  pinListing: (table: string, listingId: string, pinned: boolean) => Promise<void>;
  removeListing: (table: string, listingId: string) => Promise<void>;
  stats: ModerationStats;
  isLoading: boolean;
}

export function useModeration(): UseModerationReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch pending reports
  const { data: pendingReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['moderation', 'reports', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return (data ?? []) as Report[];
    },
    enabled: !!user,
  });

  // Fetch stats
  const { data: stats = { totalReports: 0, pendingReports: 0, resolvedToday: 0, activeListings: 0 }, isLoading: statsLoading } = useQuery({
    queryKey: ['moderation', 'stats'],
    queryFn: async () => {
      const { count: totalReports } = await supabase
        .from('reports')
        .select('id', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from('reports')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: resolvedToday } = await supabase
        .from('reports')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'resolved')
        .gte('resolved_at', today.toISOString());

      // Count active listings across main tables
      const tables = ['rentals', 'marketplace_items', 'forum_posts', 'events', 'services', 'tutoring_listings'];
      let activeListings = 0;
      for (const table of tables) {
        const { count } = await supabase
          .from(table)
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active');
        activeListings += count ?? 0;
      }

      return {
        totalReports: totalReports ?? 0,
        pendingReports: pendingCount ?? 0,
        resolvedToday: resolvedToday ?? 0,
        activeListings,
      };
    },
    enabled: !!user,
  });

  // Resolve report mutation
  const resolveReportMutation = useMutation({
    mutationFn: async ({ reportId, action }: { reportId: string; action: 'dismiss' | 'warn' | 'remove' }) => {
      const report = pendingReports.find((r) => r.id === reportId);
      if (!report) throw new Error('Report not found');

      if (action === 'dismiss') {
        const { error } = await supabase
          .from('reports')
          .update({
            status: 'dismissed',
            moderator_id: user!.id,
            resolved_at: new Date().toISOString(),
          })
          .eq('id', reportId);
        if (error) throw new Error(error.message);
      } else if (action === 'remove') {
        // Remove the target listing
        if (report.target_type === 'listing') {
          // Try to find which table the listing belongs to
          const tables = ['rentals', 'marketplace_items', 'forum_posts', 'events', 'lost_found_items', 'services', 'tutoring_listings', 'announcements'];
          for (const table of tables) {
            await supabase
              .from(table)
              .update({ status: 'removed' })
              .eq('id', report.target_id);
          }
        }

        const { error } = await supabase
          .from('reports')
          .update({
            status: 'resolved',
            moderator_id: user!.id,
            resolved_at: new Date().toISOString(),
          })
          .eq('id', reportId);
        if (error) throw new Error(error.message);
      } else {
        // warn - just mark as reviewed
        const { error } = await supabase
          .from('reports')
          .update({
            status: 'reviewed',
            moderator_id: user!.id,
            resolved_at: new Date().toISOString(),
          })
          .eq('id', reportId);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
    },
  });

  // Pin listing mutation
  const pinListingMutation = useMutation({
    mutationFn: async ({ table, listingId, pinned }: { table: string; listingId: string; pinned: boolean }) => {
      const { error } = await supabase
        .from(table)
        .update({ is_pinned: pinned })
        .eq('id', listingId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  // Remove listing mutation
  const removeListingMutation = useMutation({
    mutationFn: async ({ table, listingId }: { table: string; listingId: string }) => {
      const { error } = await supabase
        .from(table)
        .update({ status: 'removed' })
        .eq('id', listingId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  const resolveReport = async (reportId: string, action: 'dismiss' | 'warn' | 'remove') => {
    await resolveReportMutation.mutateAsync({ reportId, action });
  };

  const pinListing = async (table: string, listingId: string, pinned: boolean) => {
    await pinListingMutation.mutateAsync({ table, listingId, pinned });
  };

  const removeListing = async (table: string, listingId: string) => {
    await removeListingMutation.mutateAsync({ table, listingId });
  };

  return {
    pendingReports,
    resolveReport,
    pinListing,
    removeListing,
    stats,
    isLoading: reportsLoading || statsLoading,
  };
}
