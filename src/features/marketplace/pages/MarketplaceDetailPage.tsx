import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, Flag, Trash2 } from 'lucide-react';
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
import type { MarketplaceItem } from '@/shared/types';

const categoryLabels: Record<MarketplaceItem['category'], string> = {
  notes: 'Apuntes y Resúmenes',
  electronics: 'Electrónica y Tecnología',
  furniture: 'Muebles y Equipamiento',
  books: 'Libros y Manuales',
  bikes: 'Bicis y Transporte',
  other: 'Indumentaria, Útiles y Otros',
};

const conditionLabels: Record<MarketplaceItem['condition'], string> = {
  new: 'Nuevo',
  like_new: 'Como nuevo',
  good: 'Buen estado',
  fair: 'Usado',
};

const conditionVariants: Record<MarketplaceItem['condition'], 'success' | 'info' | 'default' | 'warning'> = {
  new: 'success',
  like_new: 'success',
  good: 'info',
  fair: 'warning',
};

export function MarketplaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { submitReport, isSubmitting: isReporting } = useReport();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ['marketplace-item', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*, author:user_profiles!author_id(*)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as MarketplaceItem;
    },
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!item) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('marketplace_items').delete().eq('id', item.id);
      if (error) throw error;
      toast.success('Producto eliminado exitosamente');
      navigate('/marketplace');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar publicación');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleFavorite = async () => {
    if (!item) return;
    await toggleFavorite('marketplace', item.id);
  };

  const handleReport = async (reason: 'spam' | 'inappropriate' | 'scam' | 'harassment' | 'other') => {
    if (!item) return;
    try {
      await submitReport({ targetType: 'listing', targetId: item.id, reason });
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
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-gray-500">Artículo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/marketplace')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al marketplace
      </button>

      <ImageGallery images={item.image_urls} alt={item.title} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Title and price */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={conditionVariants[item.condition]}>
                {conditionLabels[item.condition]}
              </Badge>
              <Badge variant="default">{categoryLabels[item.category]}</Badge>
              {item.is_free && <Badge variant="free">Gratis</Badge>}
              {item.is_pinned && <Badge variant="pinned">Fijado</Badge>}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {item.title}
            </h1>
            <div className="mt-2">
              {item.is_free ? (
                <span className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                  Gratis
                </span>
              ) : (
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ${item.price?.toLocaleString('es-AR')}
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
              {item.description}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Publicado {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {item.author && (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Avatar
                  src={item.author.avatar_url}
                  name={item.author.full_name}
                  size="md"
                  isVerified={item.author.is_verified}
                  showVerified
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {item.author.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Miembro desde {format(new Date(item.author.created_at), 'MMMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>

              {user && (
                <div className="mt-4">
                  <ContactInfo
                    phone={item.author.contact_phone}
                    instagram={item.author.contact_instagram}
                    email={item.author.email}
                  />
                </div>
              )}
            </div>
          )}

          {user && (
            <div className="flex flex-col gap-2">
              <Button
                variant={isFavorited('marketplace', item.id) ? 'secondary' : 'primary'}
                fullWidth
                onClick={handleFavorite}
                leftIcon={<Heart className={`h-4 w-4 ${isFavorited('marketplace', item.id) ? 'fill-current' : ''}`} />}
              >
                {isFavorited('marketplace', item.id) ? 'Guardado' : 'Guardar'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowReportModal(true)}
                leftIcon={<Flag className="h-4 w-4" />}
              >
                Reportar
              </Button>
              {profile && (profile.id === item.author_id || profile.role === 'admin' || profile.role === 'moderator') && (
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

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Reportar publicación">
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
