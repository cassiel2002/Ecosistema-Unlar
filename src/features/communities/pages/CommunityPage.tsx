import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Users, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useCommunity } from '../hooks/useCommunity';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';

interface Community {
  id: string;
  career_id: string;
  name: string;
  description: string | null;
  member_count: number;
  created_at: string;
  career?: {
    id: string;
    name: string;
    faculty: string;
  };
}

export function CommunityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: community, isLoading: isLoadingCommunity } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*, career:careers!career_id(id, name, faculty)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as Community;
    },
    enabled: !!id,
  });

  const {
    isMember,
    members,
    isLoadingMembers,
    join,
    leave,
    isJoining,
    isLeaving,
  } = useCommunity(id ?? '');

  const handleJoin = async () => {
    try {
      await join();
      toast.success('Te uniste a la comunidad');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al unirse');
    }
  };

  const handleLeave = async () => {
    try {
      await leave();
      toast.success('Saliste de la comunidad');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al salir');
    }
  };

  if (isLoadingCommunity) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Skeleton variant="text" height={32} className="w-1/3" />
        <Skeleton variant="rectangular" height={200} className="w-full rounded-xl" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-gray-500">Comunidad no encontrada</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/communities')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a comunidades
      </button>

      {/* Community header */}
      <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {community.name}
              </h1>
              {community.career && (
                <Badge variant="info" size="sm">
                  {community.career.name} - {community.career.faculty}
                </Badge>
              )}
              {community.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {community.description}
                </p>
              )}
            </div>
          </div>

          {user && (
            <div>
              {isMember ? (
                <Button
                  variant="secondary"
                  onClick={handleLeave}
                  isLoading={isLeaving}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Salir
                </Button>
              ) : (
                <Button
                  onClick={handleJoin}
                  isLoading={isJoining}
                  leftIcon={<LogIn className="h-4 w-4" />}
                >
                  Unirse
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span>{community.member_count} miembros</span>
        </div>
      </div>

      {/* Members list */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Miembros
        </h2>

        {isLoadingMembers ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} className="w-full rounded-lg" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            title="Sin miembros"
            description="Sé el primero en unirte a esta comunidad."
          />
        ) : (
          <div className="mt-4 space-y-2">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
              >
                <Avatar
                  src={member.user?.avatar_url ?? null}
                  name={member.user?.full_name ?? 'Usuario'}
                  size="sm"
                  isVerified={member.user?.is_verified}
                  showVerified
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {member.user?.full_name ?? 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Se unió {new Date(member.joined_at).toLocaleDateString('es-AR')}
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
