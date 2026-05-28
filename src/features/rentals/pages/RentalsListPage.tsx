import { ModuleListPage } from '@/features/home/components/ModuleListPage';
import { RentalPreviewCard } from '@/features/home/components/RentalPreviewCard';
import { mockRentals } from '@/shared/constants/mockData';
import type { Rental } from '@/shared/types';

const filters = [
  {
    label: 'Todos',
    value: 'todos',
    filterFn: () => true,
  },
  {
    label: 'Departamento',
    value: 'departamento',
    filterFn: (item: Record<string, unknown>) => item.type === 'apartment',
  },
  {
    label: 'Habitación',
    value: 'habitacion',
    filterFn: (item: Record<string, unknown>) => item.type === 'room',
  },
  {
    label: 'Compartido',
    value: 'compartido',
    filterFn: (item: Record<string, unknown>) => item.type === 'shared',
  },
  {
    label: 'Centro',
    value: 'centro',
    filterFn: (item: Record<string, unknown>) => (item.neighborhood as string)?.toLowerCase().includes('centro'),
  },
  {
    label: 'Barrio Norte',
    value: 'barrio-norte',
    filterFn: (item: Record<string, unknown>) => (item.neighborhood as string)?.toLowerCase().includes('barrio norte'),
  },
  {
    label: 'Ciudad Universitaria',
    value: 'ciudad-universitaria',
    filterFn: (item: Record<string, unknown>) => (item.neighborhood as string)?.toLowerCase().includes('ciudad universitaria'),
  },
  {
    label: 'Acepta mascotas',
    value: 'mascotas',
    filterFn: (item: Record<string, unknown>) => item.allows_pets === true,
  },
];

export function RentalsListPage() {
  return (
    <ModuleListPage
      title="Alquileres"
      tableName="rentals"
      mockData={mockRentals as unknown as Record<string, unknown>[]}
      filters={filters}
      cardRenderer={(item) => <RentalPreviewCard rental={item as unknown as Partial<Rental>} />}
      createRoute="/alquileres/nuevo"
    />
  );
}
