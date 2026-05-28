import { motion } from 'framer-motion';
import { ArrowUp, MessageCircle, CheckCircle2 } from 'lucide-react';
import type { ForumPost } from '@/shared/types';

interface ForumPreviewCardProps {
  post: Partial<ForumPost>;
}

const categoryLabels: Record<string, string> = {
  question: 'Pregunta',
  review: 'Review',
  recommendation: 'Recomendación',
  discussion: 'Discusión',
};

const categoryColors: Record<string, string> = {
  question: 'bg-blue-600/20 text-blue-400',
  review: 'bg-amber-600/20 text-amber-400',
  recommendation: 'bg-emerald-600/20 text-emerald-400',
  discussion: 'bg-purple-600/20 text-purple-400',
};

export function ForumPreviewCard({ post }: ForumPreviewCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer transition-colors hover:border-gray-700"
    >
      {/* Category badge + answered */}
      <div className="flex items-center gap-2 mb-3">
        {post.category && (
          <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${categoryColors[post.category] || 'bg-gray-800 text-gray-400'}`}>
            {categoryLabels[post.category]}
          </span>
        )}
        {post.is_answered && (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-600/20 text-emerald-400 text-xs font-medium rounded-lg">
            <CheckCircle2 className="h-3 w-3" />
            Respondida
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-2">
        {post.title}
      </h3>

      {/* Description preview */}
      {post.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{post.description}</p>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-800 text-xs text-gray-500 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-800">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <ArrowUp className="h-3.5 w-3.5 text-primary-400" />
          {(post.upvotes || 0) - (post.downvotes || 0)}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <MessageCircle className="h-3.5 w-3.5" />
          {post.comment_count || 0} respuestas
        </span>
      </div>
    </motion.div>
  );
}
