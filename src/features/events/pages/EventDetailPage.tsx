import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, Users, Video, ExternalLink, Clock, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useEventRegistration } from '../hooks/useEventRegistration';
import { ImageGallery } from '@/shared/ui/ImageGallery';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Modal } from '@/shared/ui/Modal';
import type { Event } from '@/shared/types';

const typeLabels: Record<Event['event_type'], string> = {
  hackathon: 'Hackathon',
  talk: 'Charla',
  workshop: 'Taller',
  tournament: 'Torneo',
  social: 'Social',
  academic: 'Académico',
};

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, author:user_profiles!author_id(*)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as Event;
    },
    enabled: !!id,
  });

  const {
    isRegistered,
    register: registerForEvent,
    unregister: unregisterFromEvent,
    isMutating,
    attendeeCount,
  } = useEventRegistration(id ?? '');

  const handleRegister = async () => {
    try {
      await registerForEvent();
      toast.success('Te registraste al evento');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al registrarse');
    }
  };

  const handleUnregister = async () => {
    try {
      await unregisterFromEvent();
      toast.success('Cancelaste tu registro');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cancelar registro');
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('events').delete().eq('id', event.id);
      if (error) throw error;
      toast.success('Evento eliminado exitosamente');
      navigate('/events');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar publicación');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Skeleton variant="rectangular" height={300} className="w-full rounded-xl" />
        <Skeleton variant="text" height={32} className="w-2/3" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-gray-500">Evento no encontrado</p>
      </div>
    );
  }

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isEventPast = isPast(startDate);
  const isFull = event.max_attendees ? attendeeCount >= event.max_attendees : false;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/events')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </button>

      {/* Image Gallery */}
      {event.image_urls.length > 0 && (
        <ImageGallery images={event.image_urls} alt={event.title} />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info" size="md">{typeLabels[event.event_type]}</Badge>
            {event.is_virtual && (
              <Badge variant="info" size="md">
                <Video className="h-3.5 w-3.5" />
                <span className="ml-0.5">Virtual</span>
              </Badge>
            )}
            {isEventPast && <Badge variant="default" size="md">Finalizado</Badge>}
            {isFull && !isEventPast && <Badge variant="warning" size="md">Lleno</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {event.title}
          </h1>

          {/* Date and time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>
                {format(startDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>
                {format(startDate, 'HH:mm', { locale: es })}
                {endDate && ` - ${format(endDate, 'HH:mm', { locale: es })}`}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Descripción
            </h2>
            <p className="mt-2 whitespace-pre-line text-gray-600 dark:text-gray-300">
              {event.description}
            </p>
          </div>

          {/* Organizer */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-500">Organizado por</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{event.organizer}</p>
          </div>

          {/* Virtual link - only for registered users */}
          {event.is_virtual && event.virtual_link && user && isRegistered && (
            <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/30">
              <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Link del evento virtual
              </p>
              <a
                href={event.virtual_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-primary-600 hover:underline dark:text-primary-400"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Unirse al evento
              </a>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Publicado {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Attendees card */}
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="font-medium">
                {attendeeCount}
                {event.max_attendees ? ` / ${event.max_attendees}` : ''} asistentes
              </span>
            </div>

            {event.max_attendees && (
              <div className="mt-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all"
                    style={{ width: `${Math.min((attendeeCount / event.max_attendees) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Registration button */}
            {user && !isEventPast && (
              <div className="mt-4">
                {isRegistered ? (
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={handleUnregister}
                    isLoading={isMutating}
                  >
                    Cancelar registro
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    onClick={handleRegister}
                    isLoading={isMutating}
                    disabled={isFull}
                  >
                    {isFull ? 'Evento lleno' : 'Registrarme'}
                  </Button>
                )}
              </div>
            )}

            {!user && !isEventPast && (
              <p className="mt-3 text-center text-xs text-gray-500">
                Iniciá sesión para registrarte
              </p>
            )}
          </div>

          {/* Author card */}
          {event.author && (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Avatar
                  src={event.author.avatar_url}
                  name={event.author.full_name}
                  size="md"
                  isVerified={event.author.is_verified}
                  showVerified
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {event.author.full_name}
                  </p>
                  <p className="text-xs text-gray-500">Creador del evento</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {profile && (profile.id === event.author_id || profile.role === 'admin' || profile.role === 'moderator') && (
            <div className="flex flex-col gap-2">
              <Button
                variant="danger"
                fullWidth
                onClick={() => setShowDeleteModal(true)}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Eliminar evento
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar evento"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que querés eliminar este evento? Esta acción no se puede deshacer y borrará permanentemente todos los datos y registros asociados.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
