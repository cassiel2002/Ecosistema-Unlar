import { useState, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { BaseListing } from '@/shared/types';

export interface UseCreateListingOptions {
  table: string;
  onSuccess?: (id: string) => void;
}

export interface UseCreateListingReturn<T> {
  create: (
    data: Omit<
      T,
      'id' | 'author_id' | 'created_at' | 'updated_at' | 'view_count' | 'favorite_count' | 'report_count'
    >
  ) => Promise<string>;
  isCreating: boolean;
  error: Error | null;
  uploadImages: (files: File[]) => Promise<string[]>;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_STORAGE_KEY = 'listing_creation_timestamps';

function checkRateLimit(): boolean {
  const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  const timestamps: number[] = stored ? JSON.parse(stored) : [];
  const now = Date.now();
  const recentTimestamps = timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  return recentTimestamps.length < RATE_LIMIT_MAX;
}

function recordCreation(): void {
  const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  const timestamps: number[] = stored ? JSON.parse(stored) : [];
  const now = Date.now();
  const recentTimestamps = timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  recentTimestamps.push(now);
  localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(recentTimestamps));
}

export function useCreateListing<T extends BaseListing>(
  options: UseCreateListingOptions
): UseCreateListingReturn<T> {
  const { table, onSuccess } = options;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);
  const createdIdRef = useRef<string | null>(null);

  const uploadImages = useCallback(
    async (files: File[]): Promise<string[]> => {
      if (!user) {
        throw new Error('User must be authenticated to upload images');
      }

      if (files.length > 6) {
        throw new Error('Maximum 6 images allowed per listing');
      }

      const uploadedUrls: string[] = [];

      for (const file of files) {
        // Validate file format
        const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validFormats.includes(file.type)) {
          throw new Error(
            `Invalid file format: ${file.name}. Only JPG, PNG, and WebP are allowed.`
          );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error(
            `File too large: ${file.name}. Maximum size is 5MB.`
          );
        }

        const fileExt = file.name.split('.').pop() ?? 'jpg';
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `listing-images/${table}/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error(`[useCreateListing] Upload failed for '${file.name}':`, uploadError);
          throw new Error(`Error al subir ${file.name}: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      return uploadedUrls;
    },
    [user, table]
  );

  const mutation = useMutation({
    mutationFn: async (
      data: Omit<
        T,
        'id' | 'author_id' | 'created_at' | 'updated_at' | 'view_count' | 'favorite_count' | 'report_count'
      >
    ) => {
      if (!user) {
        throw new Error('User must be authenticated to create a listing');
      }

      if (!checkRateLimit()) {
        throw new Error(
          'You are posting too fast. Please wait before creating another listing (max 5 per hour).'
        );
      }

      const record = {
        ...data,
        author_id: user.id,
        status: 'active',
        view_count: 0,
        favorite_count: 0,
        report_count: 0,
        is_pinned: false,
      };

      const { data: created, error: insertError } = await supabase
        .from(table)
        .insert(record)
        .select('id')
        .single();

      if (insertError) {
        console.error(`[useCreateListing] INSERT into '${table}' failed:`, insertError);
        console.error('[useCreateListing] Record attempted:', JSON.stringify(record, null, 2));
        throw new Error(`Error al publicar: ${insertError.message} (code: ${insertError.code})`);
      }

      recordCreation();
      return created.id as string;
    },
    onSuccess: (id) => {
      createdIdRef.current = id;
      queryClient.invalidateQueries({ queryKey: ['listings', table] });
      onSuccess?.(id);
    },
    onError: (err: Error) => {
      setError(err);
    },
  });

  const create = useCallback(
    async (
      data: Omit<
        T,
        'id' | 'author_id' | 'created_at' | 'updated_at' | 'view_count' | 'favorite_count' | 'report_count'
      >
    ): Promise<string> => {
      setError(null);
      return mutation.mutateAsync(data);
    },
    [mutation]
  );

  return {
    create,
    isCreating: mutation.isPending,
    error: error ?? (mutation.error as Error | null),
    uploadImages,
  };
}
