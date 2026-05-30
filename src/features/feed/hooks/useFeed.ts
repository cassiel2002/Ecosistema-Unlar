import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { FeedItem } from '@/shared/types';

interface FeedPage {
  items: FeedItem[];
  nextPage: number | null;
}

const FEED_TABLES = [
  { table: 'rentals', module: 'rental' as const },
  { table: 'marketplace_items', module: 'marketplace' as const },
  { table: 'forum_posts', module: 'forum' as const },
  { table: 'events', module: 'event' as const },
  { table: 'lost_found_items', module: 'lost_found' as const },
  { table: 'services', module: 'service' as const },
  { table: 'tutoring_listings', module: 'tutoring' as const },
  { table: 'announcements', module: 'announcement' as const },
];

export function computeFeedScore(item: FeedItem, userCareer: string | null): number {
  let score = 0;

  // Recency: exponential decay over 24 hours
  const hoursAge = (Date.now() - new Date(item.created_at).getTime()) / 3600000;
  score += Math.exp(-hoursAge / 24) * 100;

  // Pinned items get maximum priority
  if (item.is_pinned) score += 1000;

  // Career relevance boost
  if (item.related_career_id && item.related_career_id === userCareer) score += 50;

  // Engagement signals
  score += Math.log((item.view_count || 0) + 1) * 2;
  score += (item.favorite_count || 0) * 5;
  score += (item.comment_count || 0) * 3;

  // Priority boost for announcements
  if (item.module === 'announcement') {
    if (item.priority === 'urgent') score += 500;
    if (item.priority === 'important') score += 200;
  }

  return score;
}

function deduplicateById(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

async function fetchFeedPage(
  page: number,
  pageSize: number,
  userCareer: string | null
): Promise<FeedPage> {
  const now = new Date().toISOString();
  const limitPerTable = Math.ceil((pageSize * 2) / FEED_TABLES.length);

  const fetchPromises = FEED_TABLES.map(async ({ table, module }) => {
    let query = supabase
      .from(table)
      .select('id, author_id, title, description, image_urls, status, is_pinned, view_count, favorite_count, report_count, created_at, updated_at')
      .eq('status', 'active')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limitPerTable);

    // For announcements, exclude expired
    if (table === 'announcements') {
      query = query.or(`expires_at.is.null,expires_at.gt.${now}`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((item: Record<string, unknown>) => ({
      ...item,
      module,
      priority: table === 'announcements' ? (item as { priority?: string }).priority : undefined,
      related_career_id: (item as { related_career_id?: string }).related_career_id ?? null,
      comment_count: (item as { comment_count?: number }).comment_count ?? 0,
    })) as FeedItem[];
  });

  const results = await Promise.all(fetchPromises);
  let allItems = deduplicateById(results.flat());

  // Filter out expired announcements client-side as well
  allItems = allItems.filter((item) => item.status === 'active');

  // Sort by composite score
  allItems.sort((a, b) => {
    const scoreA = computeFeedScore(a, userCareer);
    const scoreB = computeFeedScore(b, userCareer);
    return scoreB - scoreA;
  });

  // Paginate
  const start = page * pageSize;
  const end = start + pageSize;
  const pageItems = allItems.slice(start, end);
  const hasMore = end < allItems.length;

  return {
    items: pageItems,
    nextPage: hasMore ? page + 1 : null,
  };
}

export function useFeed() {
  const { profile } = useAuth();
  const userCareer = profile?.career_id ?? null;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['feed', userCareer],
    queryFn: ({ pageParam = 0 }) => fetchFeedPage(pageParam, 20, userCareer),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const items = deduplicateById(data?.pages.flatMap((p) => p.items) ?? []);

  return {
    items,
    isLoading,
    error: error as Error | null,
    hasMore: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
}
