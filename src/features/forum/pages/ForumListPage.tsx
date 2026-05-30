import { ModuleListPage } from '@/features/home/components/ModuleListPage';
import { ForumPreviewCard } from '@/features/home/components/ForumPreviewCard';
import { mockForumPosts } from '@/shared/constants/mockData';
import type { ForumPost } from '@/shared/types';

const filters = [
  {
    label: 'Todos',
    value: 'todos',
    filterFn: () => true,
  },
  {
    label: 'Preguntas',
    value: 'preguntas',
    filterFn: (item: Record<string, unknown>) => item.category === 'question',
  },
  {
    label: 'Reviews',
    value: 'reviews',
    filterFn: (item: Record<string, unknown>) => item.category === 'review',
  },
  {
    label: 'Recomendaciones',
    value: 'recomendaciones',
    filterFn: (item: Record<string, unknown>) => item.category === 'recommendation',
  },
  {
    label: 'Discusión',
    value: 'discusion',
    filterFn: (item: Record<string, unknown>) => item.category === 'discussion',
  },
];

export function ForumListPage() {
  return (
    <ModuleListPage
      title="Foro"
      tableName="forum_posts"
      mockData={mockForumPosts as unknown as Record<string, unknown>[]}
      filters={filters}
      cardRenderer={(item) => <ForumPreviewCard post={item as unknown as Partial<ForumPost>} />}
      createRoute="/foro/nuevo"
    />
  );
}
