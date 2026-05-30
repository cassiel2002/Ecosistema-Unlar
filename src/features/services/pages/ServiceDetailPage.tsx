import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, Flag, ExternalLink, Clock, Trash2 } from 'lucide-react';
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
import { ReputationBadge } from '@/shared/ui/ReputationBadge';
import type { Service } from '@/shared/types';

const typeLabels: Record<Service['service_type'], string> = {
  design: 'Diseño',
  programming: 'Programación',
  photography: 'Fotografía',
  tutoring: 'Tutoría',
  writing: 'Redacción',
  other: 'Otro',
};

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { submitReport, isSubmitting: isReporting } = useReport();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      // Fallback para datos de prueba (mock)
      if (id?.startsWith('mock-')) {
        const { mockServices } = await import('@/shared/constants/mockData');
        const mock = mockServices.find(s => s.id === id);
        if (mock) return mock as Service;
      }

      const { data, error } = await supabase
        .from('services')
        .select('*, author:user_profiles!author_id(*)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as Service;
    },
    enabled: !!id,
    retry: false,
  });

  const handleDelete = async () => {
    if (!service) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('services').delete().eq('id', service.id);
      if (error) throw error;
      toast.success('Servicio de estudiante eliminado exitosamente');
      navigate('/services');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar publicación');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleFavorite = async () => {
    if (!service) return;
    await toggleFavorite('service', service.id);
  };

  const handleReport = async (reason: 'spam' | 'inappropriate' | 'scam' | 'harassment' | 'other') => {
    if (!service) return;
    try {
      await submitReport({ targetType: 'listing', targetId: service.id, reason });
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

  if (!service) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-gray-500">Servicio no encontrado</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/services')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a servicios
      </button>

      <ImageGallery images={service.image_urls} alt={service.title} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Title and badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{typeLabels[service.service_type]}</Badge>
              {service.is_pinned && <Badge variant="pinned">Fijado</Badge>}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {service.title}
            </h1>
            {service.price_range && (
              <p className="mt-1 text-lg font-semibold text-primary-600 dark:text-primary-400">
                {service.price_range}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Descripción
            </h2>
            <p className="mt-2 whitespace-pre-line text-gray-600 dark:text-gray-300">
              {service.description}
            </p>
          </div>

          {/* Availability */}
          {service.availability && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Disponibilidad
              </h2>
              <div className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span>{service.availability}</span>
              </div>
            </div>
          )}

          {/* Portfolio */}
          {service.portfolio_urls.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Portfolio
              </h2>
              <ul className="mt-2 space-y-2">
                {service.portfolio_urls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Publicado {formatDistanceToNow(new Date(service.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {service.author && (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Avatar
                  src={service.author.avatar_url}
                  name={service.author.full_name}
                  size="md"
                  isVerified={service.author.is_verified}
                  showVerified
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {service.author.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Miembro desde {format(new Date(service.author.created_at), 'MMMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <ReputationBadge score={service.author.reputation_score} size="md" />
              </div>

              {user && (
                <div className="mt-4">
                  <ContactInfo
                    phone={service.author.contact_phone}
                    instagram={service.author.contact_instagram}
                    email={service.author.email}
                  />
                </div>
              )}
            </div>
          )}

          {user && (
            <div className="flex flex-col gap-2">
              <Button
                variant={isFavorited('service', service.id) ? 'secondary' : 'primary'}
                fullWidth
                onClick={handleFavorite}
                leftIcon={<Heart className={`h-4 w-4 ${isFavorited('service', service.id) ? 'fill-current' : ''}`} />}
              >
                {isFavorited('service', service.id) ? 'Guardado' : 'Guardar'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowReportModal(true)}
                leftIcon={<Flag className="h-4 w-4" />}
              >
                Reportar
              </Button>
              {profile && (profile.id === service.author_id || profile.role === 'admin' || profile.role === 'moderator') && (
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

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Reportar servicio">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Por qué querés reportar este servicio?
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
