import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { Report } from '@/shared/types';

export interface UseReportReturn {
  submitReport: (data: {
    targetType: 'listing' | 'comment' | 'user';
    targetId: string;
    reason: Report['reason'];
    description?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  hasReported: (targetType: string, targetId: string) => boolean;
}

const AUTO_HIDE_THRESHOLD = 3;

export function useReport(): UseReportReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ['user-reports', user?.id];

  // Fetch user's existing reports to check for duplicates
  const { data: userReports = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('reports')
        .select('target_type, target_id')
        .eq('reporter_id', user.id);

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: !!user,
  });

  const hasReported = useCallback(
    (targetType: string, targetId: string): boolean => {
      return userReports.some(
        (report) =>
          report.target_type === targetType && report.target_id === targetId
      );
    },
    [userReports]
  );

  const reportMutation = useMutation({
    mutationFn: async (data: {
      targetType: 'listing' | 'comment' | 'user';
      targetId: string;
      reason: Report['reason'];
      description?: string;
    }) => {
      if (!user) {
        throw new Error('User must be authenticated to submit a report');
      }

      // Self-report prevention: check if the target belongs to the current user
      if (data.targetType === 'listing') {
        // Check across common listing tables
        const tables = [
          'rentals',
          'marketplace_items',
          'forum_posts',
          'events',
          'lost_found_items',
          'services',
          'tutoring_listings',
          'announcements',
        ];

        for (const table of tables) {
          const { data: listing } = await supabase
            .from(table)
            .select('author_id')
            .eq('id', data.targetId)
            .single();

          if (listing && listing.author_id === user.id) {
            throw new Error('You cannot report your own content');
          }
        }
      }

      if (data.targetType === 'comment') {
        const { data: comment } = await supabase
          .from('comments')
          .select('author_id')
          .eq('id', data.targetId)
          .single();

        if (comment && comment.author_id === user.id) {
          throw new Error('You cannot report your own content');
        }
      }

      // Duplicate prevention
      if (hasReported(data.targetType, data.targetId)) {
        throw new Error('You have already reported this content');
      }

      // Create the report
      const { error: insertError } = await supabase.from('reports').insert({
        reporter_id: user.id,
        target_type: data.targetType,
        target_id: data.targetId,
        reason: data.reason,
        description: data.description ?? null,
        status: 'pending',
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Check if auto-hide threshold is reached for listings
      if (data.targetType === 'listing') {
        const { count } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('target_type', 'listing')
          .eq('target_id', data.targetId)
          .eq('status', 'pending');

        if (count && count >= AUTO_HIDE_THRESHOLD) {
          // Auto-hide: update listing status across all tables
          const tables = [
            'rentals',
            'marketplace_items',
            'forum_posts',
            'events',
            'lost_found_items',
            'services',
            'tutoring_listings',
            'announcements',
          ];

          for (const table of tables) {
            await supabase
              .from(table)
              .update({ status: 'removed' })
              .eq('id', data.targetId);
          }
        }
      }

      // Increment report_count on the target if it's a listing
      if (data.targetType === 'listing') {
        const tables = [
          'rentals',
          'marketplace_items',
          'forum_posts',
          'events',
          'lost_found_items',
          'services',
          'tutoring_listings',
          'announcements',
        ];

        for (const table of tables) {
          await supabase
            .from(table)
            .update({ report_count: supabase.rpc ? undefined : undefined })
            .eq('id', data.targetId);
        }

        // Use RPC to safely increment
        await supabase.rpc('increment_report_count', {
          target_row_id: data.targetId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const submitReport = useCallback(
    async (data: {
      targetType: 'listing' | 'comment' | 'user';
      targetId: string;
      reason: Report['reason'];
      description?: string;
    }): Promise<void> => {
      await reportMutation.mutateAsync(data);
    },
    [reportMutation]
  );

  return {
    submitReport,
    isSubmitting: reportMutation.isPending,
    hasReported,
  };
}
