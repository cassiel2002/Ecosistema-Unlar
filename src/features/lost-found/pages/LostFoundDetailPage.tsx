import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { ImageGallery } from '@/shared/ui/ImageGallery';
import { ContactInfo } from '@/shared/ui/ContactInfo';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Modal } from '@/shared/ui/Modal';
import type { LostFoundItem } from '@/shared/types';

const categoryLabels: Record<LostFoundItem['category'], string> = {
  electronics: 'Electrónica',
  documents: 'Documentos',
  clothing: 'Ropa',
  keys: 'Llaves',
  other: 'Otros',
};

export function LostFoundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ['lost-found-item', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lost_found_items')
        .select('*, author:user_profiles!author_id(*)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as LostFoundItem;
    },
    enabled: !!id,
  });

  const resolveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('lost_found_items')
        .update({ is_resolved: true })
        .eq('id', id!);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success('Marcado como resuelto');
      queryClient.invalidateQueries({ queryKey: ['lost-found-item', id] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleDelete = async () => {
    if (!item) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('lost_found_items').delete().eq('id', item.id);
      if (error) throw error;
      toast.success('Publicación eliminada exitosamente');
      navigate('/lost-found');
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

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-gray-500">Reporte no encontrado</p>
      </div>
    );
  }

  const isOwner = user?.id === item.author_id;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/lost-found')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a perdidos y encontrados
      </button>

      {/* Image Gallery */}
      {item.image_urls.length > 0 && (
        <ImageGallery images={item.image_urls} alt={item.title} />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={item.item_type === 'lost' ? 'danger' : 'info'} size="md">
              {item.item_type === 'lost' ? 'Perdido' : 'Encontrado'}
            </Badge>
            <Badge variant="default" size="md">{categoryLabels[item.category]}</Badge>
            {item.is_resolved && <Badge variant="resolved" size="md">Resuelto</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {item.title}
          </h1>

          {/* Location and date */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{item.location_found}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>{format(new Date(item.date_found), "d 'de' MMMM, yyyy", { locale: es })}</span>
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

          {/* Resolve button */}
          {isOwner && !item.is_resolved && (
            <Button
              onClick={() => resolveMutation.mutate()}
              isLoading={resolveMutation.isPending}
              variant="secondary"
              leftIcon={<CheckCircle className="h-4 w-4" />}
            >
              Marcar como resuelto
            </Button>
          )}

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
                    {item.item_type === 'lost' ? 'Reportó la pérdida' : 'Encontró el objeto'}
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

          {/* Action buttons */}
          {profile && (profile.id === item.author_id || profile.role === 'admin' || profile.role === 'moderator') && (
            <div className="flex flex-col gap-2">
              <Button
                variant="danger"
                fullWidth
                onClick={() => setShowDeleteModal(true)}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Eliminar reporte
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar reporte"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que querés eliminar esta publicación? Esta acción no se puede deshacer y borrará permanentemente todos los datos asociados.
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
