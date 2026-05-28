import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Megaphone, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/core/supabase/client';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import { Skeleton } from '@/shared/ui/Skeleton';
import type { Announcement } from '@/shared/types';

const priorityLabels: Record<Announcement['priority'], string> = {
  normal: 'Normal',
  important: 'Importante',
  urgent: 'Urgente',
};

const priorityVariants: Record<Announcement['priority'], 'default' | 'warning' | 'danger'> = {
  normal: 'default',
  important: 'warning',
  urgent: 'danger',
};

const sourceLabels: Record<Announcement['source'], string> = {
  student_center: 'Centro de Estudiantes',
  faculty: 'Facultad',
  community: 'Comunidad',
};

export function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: announcement, isLoading } = useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*, author:user_profiles!author_id(*)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as Announcement;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <Skeleton variant="text" height={32} className="w-2/3" />
        <Skeleton variant="rectangular" height={200} className="w-full rounded-xl" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-center text-gray-500">Anuncio no encontrado</p>
      </div>
    );
  }

  const isExpired = announcement.expires_at && new Date(announcement.expires_at) < new Date();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/announcements')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a anuncios
      </button>

      <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
        {/* Priority and source badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={priorityVariants[announcement.priority]} size="md">
            {priorityLabels[announcement.priority]}
          </Badge>
          <Badge variant="default" size="md">
            {sourceLabels[announcement.source]}
          </Badge>
          {announcement.is_pinned && <Badge variant="pinned" size="md">Fijado</Badge>}
          {isExpired && <Badge variant="danger" size="md">Expirado</Badge>}
        </div>

        {/* Title */}
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {announcement.title}
        </h1>

        {/* Meta info */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              Publicado {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true, locale: es })}
            </span>
          </div>
          {announcement.expires_at && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>
                Vence: {format(new Date(announcement.expires_at), "d 'de' MMMM yyyy", { locale: es })}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-6">
          <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">
            {announcement.description}
          </p>
        </div>

        {/* Author */}
        {announcement.author && (
          <div className="mt-6 flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Avatar
              src={announcement.author.avatar_url}
              name={announcement.author.full_name}
              size="sm"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {announcement.author.full_name}
              </p>
              <p className="text-xs text-gray-500">
                {sourceLabels[announcement.source]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
