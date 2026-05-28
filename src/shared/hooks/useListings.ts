import { useEffect } from 'react';
import {
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import type { BaseListing } from '@/shared/types';

export interface UseListingsOptions<T> {
  table: string;
  filters?: Record<string, unknown>;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pageSize?: number;
  realtime?: boolean;
}

export interface UseListingsReturn<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  totalCount: number;
  fetchNextPage: () => void;
  refetch: () => void;
  isFetchingNextPage: boolean;
}

interface PageData<T> {
  items: T[];
  totalCount: number;
  nextPage: number | null;
}

async function fetchListingsPage<T extends BaseListing>(
  table: string,
  page: number,
  pageSize: number,
  filters?: Record<string, unknown>,
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<PageData<T>> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from(table)
    .select('*, author:user_profiles!author_id(*)', { count: 'exact' });

  // Apply full-text search with Spanish configuration
  if (search && search.trim().length >= 2) {
    const searchTerms = search
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 1)
      .map((w) => `${w}:*`)
      .join(' & ');

    if (searchTerms) {
      query = query.textSearch('title_description', searchTerms, {
        config: 'spanish',
        type: 'websearch',
      });
    }
  }

  // Apply filters
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else if (typeof value === 'object' && value !== null) {
        const filterObj = value as Record<string, unknown>;
        if ('gte' in filterObj) query = query.gte(key, filterObj.gte);
        if ('lte' in filterObj) query = query.lte(key, filterObj.lte);
        if ('gt' in filterObj) query = query.gt(key, filterObj.gt);
        if ('lt' in filterObj) query = query.lt(key, filterObj.lt);
      } else {
        query = query.eq(key, value);
      }
    }
  }

  // Apply sorting - pinned items first, then by specified sort
  if (sortBy) {
    query = query
      .order('is_pinned', { ascending: false })
      .order(sortBy, { ascending: sortOrder === 'asc' });
  } else {
    query = query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
  }

  // Apply pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;
  const items = (data as T[]) ?? [];
  const hasMore = from + items.length < totalCount;

  return {
    items,
    totalCount,
    nextPage: hasMore ? page + 1 : null,
  };
}

export function useListings<T extends BaseListing>(
  options: UseListingsOptions<T>
): UseListingsReturn<T> {
  const {
    table,
    filters,
    search,
    sortBy,
    sortOrder = 'desc',
    pageSize = 20,
    realtime = false,
  } = options;

  const queryClient = useQueryClient();

  const queryKey = ['listings', table, filters, search, sortBy, sortOrder, pageSize];

  const {
    data,
    isLoading,
    error,
    fetchNextPage: fetchNext,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) =>
      fetchListingsPage<T>(table, pageParam, pageSize, filters, search, sortBy, sortOrder),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Real-time subscription
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          queryClient.invalidateQueries({ queryKey: ['listings', table] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realtime, table, queryClient]);

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return {
    data: allItems,
    isLoading,
    error: error as Error | null,
    hasMore: hasNextPage ?? false,
    totalCount,
    fetchNextPage: fetchNext,
    refetch,
    isFetchingNextPage,
  };
}
