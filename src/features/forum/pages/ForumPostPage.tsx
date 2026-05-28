import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useVote } from '../hooks/useVote';
import { VoteButtons } from '../components/VoteButtons';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import { Skeleton } from '@/shared/ui/Skeleton';
import { CommentSection } from '@/shared/ui/CommentSection';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import type { ForumPost } from '@/shared/types';

const categoryLabels: Record<ForumPost['category'], string> = {
  question: 'Pregunta',
  review: 'Reseña',
  recommendation: 'Recomendación',
  discussion: 'Discusión',
};

export function ForumPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { getUserVote, vote } = useVote();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['forum-post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*, author:user_profiles!author_id(*)')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return data as ForumPost;
    },
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!post) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('forum_posts').delete().eq('id', post.id);
      if (error) throw error;
      toast.success('Publicación del foro eliminada exitosamente');
      navigate('/foro');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar publicación');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleVote = async (direction: 'up' | 'down') => {
    if (!user || !post) return;
    await vote(post.id, direction);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Skeleton variant="text" height={32} className="w-2/3" />
        <Skeleton variant="rectangular" height={200} className="w-full rounded-xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-gray-500">Publicación no encontrada</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/forum')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al foro
      </button>

      {/* Post */}
      <div className="flex gap-4">
        {/* Vote sidebar */}
        <div className="hidden sm:block">
          <VoteButtons
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={getUserVote(post.id)}
            onVote={handleVote}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">{categoryLabels[post.category]}</Badge>
            {post.is_answered && (
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3" />
                <span className="ml-0.5">Respondida</span>
              </Badge>
            )}
            {post.is_pinned && <Badge variant="pinned">Fijado</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>

          {/* Author info & Actions */}
          {post.author && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={post.author.avatar_url}
                  name={post.author.full_name}
                  size="sm"
                  isVerified={post.author.is_verified}
                  showVerified
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {post.author.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
              {profile && (profile.id === post.author_id || profile.role === 'admin' || profile.role === 'moderator') && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-red-950/20 hover:text-red-400 transition-colors"
                  title="Eliminar publicación"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-200">
              {post.description}
            </p>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Mobile votes */}
          <div className="sm:hidden">
            <VoteButtons
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              userVote={getUserVote(post.id)}
              onVote={handleVote}
              orientation="horizontal"
            />
          </div>

          {/* Related info */}
          {(post.related_course || post.related_career_id) && (
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              {post.related_course && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Materia:</span> {post.related_course}
                </p>
              )}
            </div>
          )}

          {/* Comments section */}
          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <CommentSection targetType="forum_post" targetId={post.id} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar publicación"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que querés eliminar esta pregunta del foro? Esta acción no se puede deshacer y borrará la publicación de forma permanente.
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
