import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/core/supabase/client';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Badge } from '@/shared/ui/Badge';

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

export function CommunitiesPage() {
  const navigate = useNavigate();

  const { data: communities = [], isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*, career:careers!career_id(id, name, faculty)')
        .order('member_count', { ascending: false });

      if (error) throw new Error(error.message);
      return (data as Community[]) ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Skeleton variant="text" height={32} className="w-1/3" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={120} className="w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Comunidades
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Conectá con estudiantes de tu carrera
        </p>
      </div>

      {/* Communities grid */}
      {communities.length === 0 ? (
        <EmptyState
          title="No hay comunidades"
          description="Aún no se crearon comunidades."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {communities.map((community, index) => (
            <motion.article
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/communities/${community.id}`)}
              className="cursor-pointer rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {community.name}
                  </h3>
                  {community.career && (
                    <Badge variant="info" size="sm">
                      {community.career.faculty}
                    </Badge>
                  )}
                  {community.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                      {community.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    <span>{community.member_count} miembros</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
