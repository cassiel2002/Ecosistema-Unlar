import { useState } from 'react';
import { ChevronUp, MessageCircle, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useComments } from '@/shared/hooks/useComments';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { Avatar } from './Avatar';
import { Skeleton } from './Skeleton';
import { CommentForm } from './CommentForm';
import type { Comment } from '@/shared/types';

interface CommentSectionProps {
  targetType: string;
  targetId: string;
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  allComments: Comment[];
  onReply: (parentId: string) => void;
  onUpvote: (commentId: string) => void;
  replyingTo: string | null;
  onSubmitReply: (content: string, parentId: string) => Promise<void>;
  onCancelReply: () => void;
  isAdding: boolean;
  depth?: number;
}

function CommentItem({
  comment,
  replies,
  allComments,
  onReply,
  onUpvote,
  replyingTo,
  onSubmitReply,
  onCancelReply,
  isAdding,
  depth = 0,
}: CommentItemProps) {
  const { user } = useAuth();
  const maxDepth = 3;

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-100 pl-4 dark:border-gray-700' : ''}`}>
      <div className="space-y-2 py-3">
        {/* Author */}
        <div className="flex items-center gap-2">
          {comment.author && (
            <>
              <Avatar
                src={comment.author.avatar_url}
                name={comment.author.full_name}
                size="xs"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {comment.author.full_name}
              </span>
            </>
          )}
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
          </span>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpvote(comment.id)}
            className="inline-flex min-h-[32px] items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Votar a favor"
          >
            <ChevronUp className="h-3.5 w-3.5" />
            <span>{comment.upvotes}</span>
          </button>

          {user && depth < maxDepth && (
            <button
              onClick={() => onReply(comment.id)}
              className="inline-flex min-h-[32px] items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <Reply className="h-3.5 w-3.5" />
              Responder
            </button>
          )}
        </div>

        {/* Reply form */}
        {replyingTo === comment.id && (
          <div className="mt-2">
            <CommentForm
              onSubmit={(content) => onSubmitReply(content, comment.id)}
              isSubmitting={isAdding}
              placeholder="Escribí tu respuesta..."
              autoFocus
              onCancel={onCancelReply}
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {replies.length > 0 && (
        <div>
          {replies.map((reply) => {
            const nestedReplies = allComments.filter((c) => c.parent_id === reply.id);
            return (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={nestedReplies}
                allComments={allComments}
                onReply={onReply}
                onUpvote={onUpvote}
                replyingTo={replyingTo}
                onSubmitReply={onSubmitReply}
                onCancelReply={onCancelReply}
                isAdding={isAdding}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CommentSection({ targetType, targetId }: CommentSectionProps) {
  const { user } = useAuth();
  const { comments, isLoading, addComment, upvoteComment, isAdding } = useComments({
    targetType,
    targetId,
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Get top-level comments (no parent)
  const topLevelComments = comments.filter((c) => !c.parent_id);

  const handleSubmitReply = async (content: string, parentId: string) => {
    await addComment(content, parentId);
    setReplyingTo(null);
  };

  const handleSubmitTopLevel = async (content: string) => {
    await addComment(content);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rectangular" height={60} className="w-full rounded-lg" />
        <Skeleton variant="rectangular" height={60} className="w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Comentarios ({comments.length})
        </h3>
      </div>

      {/* Add comment form */}
      {user && (
        <CommentForm
          onSubmit={handleSubmitTopLevel}
          isSubmitting={isAdding}
        />
      )}

      {/* Comments list */}
      {topLevelComments.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">
          No hay comentarios aún. ¡Sé el primero!
        </p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {topLevelComments.map((comment) => {
            const replies = comments.filter((c) => c.parent_id === comment.id);
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={replies}
                allComments={comments}
                onReply={setReplyingTo}
                onUpvote={upvoteComment}
                replyingTo={replyingTo}
                onSubmitReply={handleSubmitReply}
                onCancelReply={() => setReplyingTo(null)}
                isAdding={isAdding}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
