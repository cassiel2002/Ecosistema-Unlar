import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Settings, Heart, MapPin, Calendar, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ReputationBadge } from '@/shared/ui/ReputationBadge';
import { ContactInfo } from '@/shared/ui/ContactInfo';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { UserProfile, BaseListing } from '@/shared/types';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile: currentProfile } = useAuth();

  // If no id param, show current user's profile
  const profileId = id ?? user?.id;
  const isOwnProfile = profileId === user?.id;

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile', profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', profileId!)
        .single();

      if (error) throw new Error(error.message);
      return data as UserProfile;
    },
    enabled: !!profileId,
  });

  // Fetch user's career info
  const { data: career } = useQuery({
    queryKey: ['career', profile?.career_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('id', profile!.career_id!)
        .single();

      if (error) return null;
      return data as { id: string; name: string; faculty: string };
    },
    enabled: !!profile?.career_id,
  });

  // Fetch user's active listings (from multiple tables)
  const { data: listings = [], isLoading: isLoadingListings } = useQuery({
    queryKey: ['user-listings', profileId],
    queryFn: async () => {
      const tables = ['rentals', 'marketplace_items', 'services', 'tutoring_listings'];
      const allListings: (BaseListing & { module: string })[] = [];

      for (const table of tables) {
        const { data } = await supabase
          .from(table)
          .select('id, title, status, created_at, image_urls, is_pinned, view_count, favorite_count, report_count, author_id, description, updated_at')
          .eq('author_id', profileId!)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5);

        if (data) {
          allListings.push(
            ...data.map((item) => ({ ...(item as any), module: table } as BaseListing & { module: string }))
          );
        }
      }

      return allListings.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!profileId,
  });

  const displayProfile = isOwnProfile ? (currentProfile ?? profile) : profile;

  if (isLoadingProfile) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" height={80} width={80} />
          <div className="space-y-2">
            <Skeleton variant="text" height={24} className="w-48" />
            <Skeleton variant="text" height={16} className="w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!displayProfile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-center text-gray-500">Perfil no encontrado</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 p-6 dark:border-gray-700"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              src={displayProfile.avatar_url}
              name={displayProfile.full_name}
              size="lg"
              isVerified={displayProfile.is_verified}
              showVerified
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {displayProfile.full_name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <ReputationBadge score={displayProfile.reputation_score} size="md" />
                {displayProfile.is_freshman && (
                  <Badge variant="success" size="sm">Ingresante</Badge>
                )}
                {displayProfile.role !== 'student' && (
                  <Badge variant="info" size="sm">
                    {displayProfile.role === 'admin' ? 'Admin' : 'Moderador'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/perfil/editar')}
                leftIcon={<Settings className="h-4 w-4" />}
              >
                Editar perfil
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/favoritos')}
                leftIcon={<Heart className="h-4 w-4" />}
              >
                Favoritos
              </Button>
            </div>
          )}
        </div>

        {/* Bio */}
        {displayProfile.bio && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            {displayProfile.bio}
          </p>
        )}

        {/* Info grid */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          {career && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>{career.name}</span>
            </div>
          )}
          {displayProfile.enrollment_year && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Ingreso {displayProfile.enrollment_year}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>
              Miembro desde {format(new Date(displayProfile.created_at), 'MMMM yyyy', { locale: es })}
            </span>
          </div>
        </div>

        {/* Contact info - only visible to authenticated users */}
        {user && (
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <ContactInfo
              phone={displayProfile.contact_phone}
              instagram={displayProfile.contact_instagram}
              email={displayProfile.email}
            />
          </div>
        )}
      </motion.div>

      {/* Active listings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Publicaciones activas
        </h2>

        {isLoadingListings ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={60} className="w-full rounded-lg" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            title="Sin publicaciones"
            description={isOwnProfile ? 'Aún no tenés publicaciones activas.' : 'Este usuario no tiene publicaciones activas.'}
          />
        ) : (
          <div className="mt-4 space-y-2">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
              >
                {listing.image_urls[0] ? (
                  <img
                    src={listing.image_urls[0]}
                    alt={listing.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {listing.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(listing.created_at), "d 'de' MMMM", { locale: es })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
