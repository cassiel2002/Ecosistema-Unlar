import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';

export interface UseSearchOptions {
  tables: string[];
  debounceMs?: number;
  minChars?: number;
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  rank?: number;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  totalResults: number;
}

function buildTsQuery(input: string): string {
  const words = input
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1);
  return words.map((w) => `${w}:*`).join(' & ');
}

async function searchTable(
  table: string,
  tsQuery: string,
  limit: number
): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from(table)
    .select('id, title, description, image_urls, created_at')
    .eq('status', 'active')
    .textSearch('title_description', tsQuery, {
      config: 'spanish',
      type: 'websearch',
    })
    .limit(limit);

  if (error) {
    // Fallback: use ilike search if full-text search column doesn't exist
    const { data: fallbackData, error: fallbackError } = await supabase
      .from(table)
      .select('id, title, description, image_urls, created_at')
      .eq('status', 'active')
      .or(`title.ilike.%${tsQuery.replace(/[&:*]/g, '')}%,description.ilike.%${tsQuery.replace(/[&:*]/g, '')}%`)
      .limit(limit);

    if (fallbackError) return [];

    return (fallbackData ?? []).map((item) => ({
      id: item.id,
      type: table,
      title: item.title,
      description: item.description,
      image_url: item.image_urls?.[0] ?? null,
      created_at: item.created_at,
    }));
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    type: table,
    title: item.title,
    description: item.description,
    image_url: item.image_urls?.[0] ?? null,
    created_at: item.created_at,
  }));
}

export function useSearch(options: UseSearchOptions): UseSearchReturn {
  const { tables, debounceMs = 300, minChars = 2 } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs]);

  const shouldSearch = debouncedQuery.trim().length >= minChars;

  const {
    data: results = [],
    isLoading: isSearching,
  } = useQuery({
    queryKey: ['search', tables, debouncedQuery],
    queryFn: async () => {
      if (!shouldSearch) return [];

      const tsQuery = buildTsQuery(debouncedQuery);
      if (!tsQuery) return [];

      const limitPerTable = Math.ceil(20 / tables.length);

      const searchPromises = tables.map((table) =>
        searchTable(table, tsQuery, limitPerTable)
      );

      const allResults = await Promise.all(searchPromises);
      const merged = allResults.flat();

      // Sort by relevance (title match first, then by recency)
      merged.sort((a, b) => {
        const queryLower = debouncedQuery.toLowerCase();
        const aInTitle = a.title.toLowerCase().includes(queryLower) ? 1 : 0;
        const bInTitle = b.title.toLowerCase().includes(queryLower) ? 1 : 0;

        if (bInTitle !== aInTitle) return bInTitle - aInTitle;

        // Then by recency
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return merged;
    },
    enabled: shouldSearch,
  });

  const handleSetQuery = useCallback((q: string) => {
    setQuery(q);
  }, []);

  return {
    query,
    setQuery: handleSetQuery,
    results: shouldSearch ? results : [],
    isSearching: shouldSearch ? isSearching : false,
    totalResults: shouldSearch ? results.length : 0,
  };
}
