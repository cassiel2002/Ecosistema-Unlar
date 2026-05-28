import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, Flag, Clock, MapPin, Monitor, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useFavorites } from '@/shared/hooks/useFavorites';
import { useReport } from '@/shared/hooks/useReport';
import { ImageGallery } from '@/shared/ui/ImageGallery';
import { ContactInfo } from '@/shared/ui/ContactInfo';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Modal } from '@/shared/ui/Modal';
import type { TutoringListing } from '@/shared/types';

const modalityLabels: Record<TutoringListing['modality'], string> = {
  in_person: 'Presencial',
  virtual: 'Virtual',
  both: 'Presencial / Virtual',
};

const modalityIcons: Record<TutoringListing['modality'], React.ReactNode> = {
  in_person: <MapPin className="h-4 w-4" />,
  virtual: <Monitor className="h-4 w-4" />,
  both: <Monitor className="h-4 w-4" />,
};

export function TutoringDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { submitReport, isSubmitting: isReporting } = useReport();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['tutoring', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutoring_listings')
        .select('*, author:user_profiles!author_id(*)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as TutoringListing;
    },
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!listing) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('tutoring_listings').delete().eq('id', listing.id);
      if (error) throw error;
      toast.success('Clase particular eliminada exitosamente');
      navigate('/clases');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar publicación');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleFavorite = async () => {
    if (!listing) return;
    await toggleFavorite('tutoring', listing.id);
  };

  const handleReport = async (reason: 'spam' | 'inappropriate' | 'scam' | 'harassment' | 'other') => {
    if (!listing) return;
    try {
      await submitReport({ targetType: 'listing', targetId: listing.id, reason });
      toast.success('Reporte enviado correctamente');
      setShowReportModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al enviar reporte');
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

  if (!listing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-gray-500">Clase no encontrada</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/tutoring')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a clases particulares
      </button>

      <ImageGallery images={listing.image_urls} alt={listing.title} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Title and badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{modalityLabels[listing.modality]}</Badge>
              {listing.is_pinned && <Badge variant="pinned">Fijado</Badge>}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {listing.title}
            </h1>
            <p className="mt-1 text-lg font-medium text-primary-600 dark:text-primary-400">
              {listing.subject}
            </p>
            <div className="mt-2">
              {listing.price_per_hour ? (
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${listing.price_per_hour.toLocaleString('es-AR')}/hora
                </span>
              ) : (
                <span className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                  A convenir
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Descripción
            </h2>
            <p className="mt-2 whitespace-pre-line text-gray-600 dark:text-gray-300">
              {listing.description}
            </p>
          </div>

          {/* Experience */}
          {listing.experience && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Experiencia
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {listing.experience}
              </p>
            </div>
          )}

          {/* Schedule */}
          {listing.schedule_availability && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Horarios disponibles
              </h2>
              <div className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span>{listing.schedule_availability}</span>
              </div>
            </div>
          )}

          {/* Modality info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Modalidad
            </h2>
            <div className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-300">
              {modalityIcons[listing.modality]}
              <span>{modalityLabels[listing.modality]}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Publicado {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {listing.author && (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Avatar
                  src={listing.author.avatar_url}
                  name={listing.author.full_name}
                  size="md"
                  isVerified={listing.author.is_verified}
                  showVerified
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {listing.author.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Miembro desde {format(new Date(listing.author.created_at), 'MMMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>

              {user && (
                <div className="mt-4">
                  <ContactInfo
                    phone={listing.author.contact_phone}
                    instagram={listing.author.contact_instagram}
                    email={listing.author.email}
                  />
                </div>
              )}
            </div>
          )}

          {user && (
            <div className="flex flex-col gap-2">
              <Button
                variant={isFavorited('tutoring', listing.id) ? 'secondary' : 'primary'}
                fullWidth
                onClick={handleFavorite}
                leftIcon={<Heart className={`h-4 w-4 ${isFavorited('tutoring', listing.id) ? 'fill-current' : ''}`} />}
              >
                {isFavorited('tutoring', listing.id) ? 'Guardado' : 'Guardar'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowReportModal(true)}
                leftIcon={<Flag className="h-4 w-4" />}
              >
                Reportar
              </Button>
              {profile && (profile.id === listing.author_id || profile.role === 'admin' || profile.role === 'moderator') && (
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowDeleteModal(true)}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Eliminar publicación
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Reportar clase">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Por qué querés reportar esta publicación?
          </p>
          {(['spam', 'inappropriate', 'scam', 'harassment', 'other'] as const).map((reason) => (
            <Button
              key={reason}
              variant="ghost"
              fullWidth
              onClick={() => handleReport(reason)}
              isLoading={isReporting}
              className="justify-start"
            >
              {{ spam: 'Spam', inappropriate: 'Contenido inapropiado', scam: 'Estafa', harassment: 'Acoso', other: 'Otro motivo' }[reason]}
            </Button>
          ))}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar publicación"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que querés eliminar esta publicación? Esta acción no se puede deshacer y la borrará permanentemente del sistema.
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
