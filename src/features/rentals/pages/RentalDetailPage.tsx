import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Heart, Flag, PawPrint, Calendar, MapPin, Users, Trash2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useFavorites } from '@/shared/hooks/useFavorites';
import { useReport } from '@/shared/hooks/useReport';
import { useChat } from '@/shared/hooks/useChat';
import { ImageGallery } from '@/shared/ui/ImageGallery';
import { ContactInfo } from '@/shared/ui/ContactInfo';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Modal } from '@/shared/ui/Modal';
import type { Rental } from '@/shared/types';
import { useState } from 'react';
import toast from 'react-hot-toast';

const typeLabels: Record<Rental['type'], string> = {
  apartment: 'Departamento',
  room: 'Habitación',
  shared: 'Compartido',
};

const genderLabels: Record<Rental['gender_preference'], string> = {
  any: 'Sin preferencia',
  male: 'Masculino',
  female: 'Femenino',
};

export function RentalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { submitReport, isSubmitting: isReporting } = useReport();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { createOrGetChat, isCreatingChat } = useChat();

  const { data: rental, isLoading } = useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      // Fallback para datos de prueba (mock)
      if (id?.startsWith('mock-')) {
        const { mockRentals } = await import('@/shared/constants/mockData');
        const mock = mockRentals.find(r => r.id === id);
        if (mock) return mock as Rental;
      }

      const { data, error } = await supabase
        .from('rentals')
        .select('*, author:user_profiles!author_id(*)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as Rental;
    },
    enabled: !!id,
    retry: false,
  });

  const handleDelete = async () => {
    if (!rental) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('rentals').delete().eq('id', rental.id);
      if (error) throw error;
      
      // Invalidate the cache so the list updates
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      
      toast.success('Alquiler eliminado exitosamente');
      navigate('/rentals');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar publicación');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleFavorite = async () => {
    if (!rental) return;
    await toggleFavorite('rental', rental.id);
  };

  const handleReport = async (reason: 'spam' | 'inappropriate' | 'scam' | 'harassment' | 'other') => {
    if (!rental) return;
    try {
      await submitReport({
        targetType: 'listing',
        targetId: rental.id,
        reason,
      });
      toast.success('Reporte enviado correctamente');
      setShowReportModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al enviar reporte');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Skeleton variant="rectangular" height={400} className="w-full rounded-xl" />
        <Skeleton variant="text" height={32} className="w-2/3" />
        <Skeleton variant="text" height={20} className="w-1/3" />
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-gray-500">Alquiler no encontrado</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/rentals')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a alquileres
      </button>

      {/* Image Gallery */}
      <ImageGallery images={rental.image_urls} alt={rental.title} />

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title and price */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{typeLabels[rental.type]}</Badge>
              {rental.is_pinned && <Badge variant="pinned">Fijado</Badge>}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {rental.title}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {rental.currency === 'USD' ? 'US$' : '$'}
                {rental.price.toLocaleString('es-AR')}
              </span>
              <span className="text-gray-500">/mes</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <p className="font-medium">{rental.location}</p>
              <p className="text-sm text-gray-500">{rental.neighborhood}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Descripción
            </h2>
            <p className="mt-2 whitespace-pre-line text-gray-600 dark:text-gray-300">
              {rental.description}
            </p>
          </div>

          {/* Amenities */}
          {rental.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Comodidades
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {rental.amenities.map((amenity) => (
                  <Badge key={amenity} variant="default" size="md">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <PawPrint className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Mascotas</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {rental.allows_pets ? 'Sí, acepta' : 'No acepta'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Preferencia de género</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {genderLabels[rental.gender_preference]}
                </p>
              </div>
            </div>
            {rental.available_from && (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Disponible desde</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {format(new Date(rental.available_from), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Meta */}
          <p className="text-xs text-gray-400">
            Publicado {formatDistanceToNow(new Date(rental.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-4">
          {/* Author card */}
          {rental.author && (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Avatar
                  src={rental.author.avatar_url}
                  name={rental.author.full_name}
                  size="md"
                  isVerified={rental.author.is_verified}
                  showVerified
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {rental.author.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Miembro desde {format(new Date(rental.author.created_at), 'MMMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>

              {user && (
                <div className="mt-4">
                  <ContactInfo
                    phone={rental.author.contact_phone}
                    instagram={rental.author.contact_instagram}
                    email={rental.author.email}
                  />
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {user && (
            <div className="flex flex-col gap-2">
              {profile && profile.id !== rental.author_id && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={async () => {
                    try {
                      const chat = await createOrGetChat(rental.author_id);
                      navigate(`/mensajes/${chat.id}`);
                    } catch (error) {
                      toast.error('Error al iniciar el chat');
                    }
                  }}
                  isLoading={isCreatingChat}
                  leftIcon={<MessageSquare className="h-4 w-4" />}
                >
                  Contactar Anunciante
                </Button>
              )}
              <Button
                variant={isFavorited('rental', rental.id) ? 'secondary' : 'primary'}
                fullWidth
                onClick={handleFavorite}
                leftIcon={
                  <Heart
                    className={`h-4 w-4 ${isFavorited('rental', rental.id) ? 'fill-current' : ''}`}
                  />
                }
              >
                {isFavorited('rental', rental.id) ? 'Guardado' : 'Guardar'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowReportModal(true)}
                leftIcon={<Flag className="h-4 w-4" />}
              >
                Reportar
              </Button>
              {profile && (profile.id === rental.author_id || profile.role === 'admin' || profile.role === 'moderator') && (
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

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Reportar publicación"
      >
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
              {{
                spam: 'Spam',
                inappropriate: 'Contenido inapropiado',
                scam: 'Estafa',
                harassment: 'Acoso',
                other: 'Otro motivo',
              }[reason]}
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
