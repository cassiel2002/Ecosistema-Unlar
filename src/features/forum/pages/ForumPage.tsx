import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchBar } from '@/shared/ui/SearchBar';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useListings } from '@/shared/hooks/useListings';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useVote } from '../hooks/useVote';
import { PostCard } from '../components/PostCard';
import type { ForumPost } from '@/shared/types';

const CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'question', label: 'Preguntas' },
  { value: 'review', label: 'Reseñas' },
  { value: 'recommendation', label: 'Recomendaciones' },
  { value: 'discussion', label: 'Discusiones' },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Más recientes' },
  { value: 'upvotes', label: 'Más votados' },
];

export function ForumPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserVote, vote } = useVote();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [tagFilter, setTagFilter] = useState('');

  const buildFilters = useCallback(() => {
    const filters: Record<string, unknown> = { status: 'active' };
    if (activeCategory) filters.category = activeCategory;
    return filters;
  }, [activeCategory]);

  const {
    data: posts,
    isLoading,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings<ForumPost>({
    table: 'forum_posts',
    filters: buildFilters(),
    search: search || tagFilter,
    sortBy,
    sortOrder: 'desc',
    pageSize: 15,
    realtime: true,
  });

  const handleVote = async (postId: string, direction: 'up' | 'down') => {
    if (!user) return;
    await vote(postId, direction);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Foro
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Preguntá, compartí y discutí con la comunidad
          </p>
        </div>
        {user && (
          <Button
            onClick={() => navigate('/forum/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Nueva publicación
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar en el foro..."
        value={search}
        onChange={setSearch}
        debounceMs={300}
      />

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`
              min-h-[36px] whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors
              ${
                activeCategory === cat.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort and tag filter */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="min-h-[36px] rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          aria-label="Ordenar por"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtrar por tag..."
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="min-h-[36px] rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          aria-label="Filtrar por tag"
        />
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={140} className="w-full rounded-xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No hay publicaciones"
          description="Sé el primero en publicar algo en el foro."
        />
      ) : (
        <>
          <div className="space-y-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <PostCard
                  post={post}
                  userVote={getUserVote(post.id)}
                  onVote={handleVote}
                  onClick={() => navigate(`/forum/${post.id}`)}
                />
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Cargar más
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
