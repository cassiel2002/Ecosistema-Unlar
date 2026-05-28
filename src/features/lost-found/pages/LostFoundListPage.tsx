import { ModuleListPage } from '@/features/home/components/ModuleListPage';
import { GenericPreviewCard } from '@/features/home/components/GenericPreviewCard';
import { mockLostFound } from '@/shared/constants/mockData';
import type { LostFoundItem } from '@/shared/types';

const filters = [
  {
    label: 'Todos',
    value: 'todos',
    filterFn: () => true,
  },
  {
    label: 'Perdido',
    value: 'perdido',
    filterFn: (item: Record<string, unknown>) => item.item_type === 'lost',
  },
  {
    label: 'Encontrado',
    value: 'encontrado',
    filterFn: (item: Record<string, unknown>) => item.item_type === 'found',
  },
  {
    label: 'Resuelto',
    value: 'resuelto',
    filterFn: (item: Record<string, unknown>) => item.is_resolved === true,
  },
];

export function LostFoundListPage() {
  return (
    <ModuleListPage
      title="Perdidos y Encontrados"
      tableName="lost_found_items"
      mockData={mockLostFound as unknown as Record<string, unknown>[]}
      filters={filters}
      cardRenderer={(item) => <GenericPreviewCard item={item as unknown as Partial<LostFoundItem>} type="lost_found" />}
      createRoute="/perdidos/nuevo"
    />
  );
}
