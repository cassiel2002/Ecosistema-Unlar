import { ModuleListPage } from '@/features/home/components/ModuleListPage';
import { GenericPreviewCard } from '@/features/home/components/GenericPreviewCard';
import { mockServices } from '@/shared/constants/mockData';
import type { Service } from '@/shared/types';

const filters = [
  {
    label: 'Todos',
    value: 'todos',
    filterFn: () => true,
  },
  {
    label: 'Diseño',
    value: 'diseno',
    filterFn: (item: Record<string, unknown>) => item.service_type === 'design',
  },
  {
    label: 'Programación',
    value: 'programacion',
    filterFn: (item: Record<string, unknown>) => item.service_type === 'programming',
  },
  {
    label: 'Fotografía',
    value: 'fotografia',
    filterFn: (item: Record<string, unknown>) => item.service_type === 'photography',
  },
  {
    label: 'Escritura',
    value: 'escritura',
    filterFn: (item: Record<string, unknown>) => item.service_type === 'writing',
  },
];

export function ServicesListPage() {
  return (
    <ModuleListPage
      title="Servicios"
      tableName="services"
      mockData={mockServices as unknown as Record<string, unknown>[]}
      filters={filters}
      cardRenderer={(item) => <GenericPreviewCard item={item as unknown as Partial<Service>} type="service" />}
      createRoute="/servicios/nuevo"
    />
  );
}
