import { ModuleListPage } from '@/features/home/components/ModuleListPage';
import { MarketplacePreviewCard } from '@/features/home/components/MarketplacePreviewCard';
import { mockMarketplaceItems } from '@/shared/constants/mockData';
import type { MarketplaceItem } from '@/shared/types';

const filters = [
  {
    label: 'Todos',
    value: 'todos',
    filterFn: () => true,
  },
  {
    label: '📚 Apuntes y Resúmenes',
    value: 'apuntes',
    filterFn: (item: Record<string, unknown>) => item.category === 'notes',
  },
  {
    label: '📕 Libros y Manuales',
    value: 'libros',
    filterFn: (item: Record<string, unknown>) => item.category === 'books',
  },
  {
    label: '💻 Electrónica y Tecnología',
    value: 'electronica',
    filterFn: (item: Record<string, unknown>) => item.category === 'electronics',
  },
  {
    label: '🪑 Muebles y Equipamiento',
    value: 'muebles',
    filterFn: (item: Record<string, unknown>) => item.category === 'furniture',
  },
  {
    label: '🚲 Bicis y Transporte',
    value: 'bicis',
    filterFn: (item: Record<string, unknown>) => item.category === 'bikes',
  },
  {
    label: 'Gratis',
    value: 'gratis',
    filterFn: (item: Record<string, unknown>) => item.is_free === true,
  },
];

export function MarketplaceListPage() {
  return (
    <ModuleListPage
      title="Compra/Venta"
      tableName="marketplace_items"
      mockData={mockMarketplaceItems as unknown as Record<string, unknown>[]}
      filters={filters}
      cardRenderer={(item) => <MarketplacePreviewCard item={item as unknown as Partial<MarketplaceItem>} />}
      createRoute="/marketplace/nuevo"
    />
  );
}
