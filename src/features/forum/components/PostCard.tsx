import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/Badge';
import { Avatar } from '@/shared/ui/Avatar';
import { VoteButtons } from './VoteButtons';
import type { ForumPost } from '@/shared/types';

interface PostCardProps {
  post: ForumPost;
  userVote: 'up' | 'down' | null;
  onVote: (postId: string, direction: 'up' | 'down') => void;
  onClick?: () => void;
}

const categoryLabels: Record<ForumPost['category'], string> = {
  question: 'Pregunta',
  review: 'Reseña',
  recommendation: 'Recomendación',
  discussion: 'Discusión',
};

const categoryVariants: Record<ForumPost['category'], 'info' | 'warning' | 'success' | 'default'> = {
  question: 'info',
  review: 'warning',
  recommendation: 'success',
  discussion: 'default',
};

export function PostCard({ post, userVote, onVote, onClick }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: es,
  });

  return (
    <article
      onClick={onClick}
      className="flex cursor-pointer gap-3 rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
    >
      {/* Vote buttons */}
      <div className="hidden sm:block">
        <VoteButtons
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          userVote={userVote}
          onVote={(direction) => onVote(post.id, direction)}
          size="sm"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={categoryVariants[post.category]}>
            {categoryLabels[post.category]}
          </Badge>
          {post.is_answered && (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              <span className="ml-0.5">Respondida</span>
            </Badge>
          )}
          {post.is_pinned && <Badge variant="pinned">Fijado</Badge>}
        </div>

        <h3 className="mt-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">
          {post.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {post.author && (
            <div className="flex items-center gap-1.5">
              <Avatar
                src={post.author.avatar_url}
                name={post.author.full_name}
                size="xs"
              />
              <span>{post.author.full_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{post.comment_count} respuestas</span>
          </div>
          <span>{timeAgo}</span>

          {/* Mobile vote display */}
          <div className="flex items-center gap-1 sm:hidden">
            <VoteButtons
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              userVote={userVote}
              onVote={(direction) => onVote(post.id, direction)}
              orientation="horizontal"
              size="sm"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
