import { ModuleListPage } from '@/features/home/components/ModuleListPage';
import { GenericPreviewCard } from '@/features/home/components/GenericPreviewCard';
import { mockTutoring } from '@/shared/constants/mockData';
import type { TutoringListing } from '@/shared/types';

const filters = [
  {
    label: 'Todos',
    value: 'todos',
    filterFn: () => true,
  },
  {
    label: 'Presencial',
    value: 'presencial',
    filterFn: (item: Record<string, unknown>) => item.modality === 'in_person' || item.modality === 'both',
  },
  {
    label: 'Virtual',
    value: 'virtual',
    filterFn: (item: Record<string, unknown>) => item.modality === 'virtual' || item.modality === 'both',
  },
  {
    label: 'Ambos',
    value: 'ambos',
    filterFn: (item: Record<string, unknown>) => item.modality === 'both',
  },
];

export function TutoringListPage() {
  return (
    <ModuleListPage
      title="Clases Particulares"
      tableName="tutoring_listings"
      mockData={mockTutoring as unknown as Record<string, unknown>[]}
      filters={filters}
      cardRenderer={(item) => <GenericPreviewCard item={item as unknown as Partial<TutoringListing>} type="tutoring" />}
      createRoute="/clases/nuevo"
    />
  );
}
