import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { calculateReputation, type UserActivity } from '@/shared/utils/reputation';

interface UseReputationReturn {
  score: number;
  activity: UserActivity | null;
  isLoading: boolean;
}

async function fetchUserActivity(userId: string): Promise<UserActivity> {
  // Fetch user profile for verified status
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_verified')
    .eq('id', userId)
    .single();

  // Fetch active listings count across all tables
  const listingTables = [
    'rentals',
    'marketplace_items',
    'forum_posts',
    'events',
    'lost_found_items',
    'services',
    'tutoring_listings',
  ];

  let activeListings = 0;
  let closedListings = 0;

  for (const table of listingTables) {
    const { count: activeCount } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'active');

    const { count: closedCount } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'closed');

    activeListings += activeCount ?? 0;
    closedListings += closedCount ?? 0;
  }

  // Forum posts
  const { count: forumPosts } = await supabase
    .from('forum_posts')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', userId);

  // Accepted answers (forum posts marked as answered by this user)
  const { count: acceptedAnswers } = await supabase
    .from('forum_posts')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', userId)
    .eq('is_answered', true);

  // Upvotes received
  const { count: upvotesReceived } = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('vote_type', 'up')
    .in('target_id', (await supabase
      .from('forum_posts')
      .select('id')
      .eq('author_id', userId)
    ).data?.map((p) => p.id) ?? []);

  // Downvotes received
  const { count: downvotesReceived } = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('vote_type', 'down')
    .in('target_id', (await supabase
      .from('forum_posts')
      .select('id')
      .eq('author_id', userId)
    ).data?.map((p) => p.id) ?? []);

  // Comments given
  const { count: commentsGiven } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', userId);

  // Events attended (via event registrations - approximate with current_attendees)
  const { count: eventsAttended } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', userId)
    .eq('status', 'closed');

  // Guides written
  const { count: guidesWritten } = await supabase
    .from('freshman_guides')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', userId);

  // Reports received
  const { count: reportsReceived } = await supabase
    .from('reports')
    .select('id', { count: 'exact', head: true })
    .eq('target_id', userId)
    .eq('target_type', 'user');

  // Removed listings
  let removedListings = 0;
  for (const table of listingTables) {
    const { count } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'removed');
    removedListings += count ?? 0;
  }

  return {
    isVerified: profile?.is_verified ?? false,
    activeListings,
    closedListings,
    forumPosts: forumPosts ?? 0,
    acceptedAnswers: acceptedAnswers ?? 0,
    upvotesReceived: upvotesReceived ?? 0,
    downvotesReceived: downvotesReceived ?? 0,
    commentsGiven: commentsGiven ?? 0,
    eventsAttended: eventsAttended ?? 0,
    guidesWritten: guidesWritten ?? 0,
    reportsReceived: reportsReceived ?? 0,
    removedListings,
  };
}

export function useReputation(userId: string | undefined): UseReputationReturn {
  const { data, isLoading } = useQuery({
    queryKey: ['reputation', userId],
    queryFn: () => fetchUserActivity(userId!),
    enabled: !!userId,
  });

  const score = data ? calculateReputation(data) : 0;

  return {
    score,
    activity: data ?? null,
    isLoading,
  };
}
