import { ModuleListPage } from '@/features/home/components/ModuleListPage';
import { EventPreviewCard } from '@/features/home/components/EventPreviewCard';
import { mockEvents } from '@/shared/constants/mockData';
import type { Event } from '@/shared/types';

const filters = [
  {
    label: 'Todos',
    value: 'todos',
    filterFn: () => true,
  },
  {
    label: 'Hackathon',
    value: 'hackathon',
    filterFn: (item: Record<string, unknown>) => item.event_type === 'hackathon',
  },
  {
    label: 'Charla',
    value: 'charla',
    filterFn: (item: Record<string, unknown>) => item.event_type === 'talk',
  },
  {
    label: 'Taller',
    value: 'taller',
    filterFn: (item: Record<string, unknown>) => item.event_type === 'workshop',
  },
  {
    label: 'Torneo',
    value: 'torneo',
    filterFn: (item: Record<string, unknown>) => item.event_type === 'tournament',
  },
  {
    label: 'Social',
    value: 'social',
    filterFn: (item: Record<string, unknown>) => item.event_type === 'social',
  },
];

export function EventsListPage() {
  return (
    <ModuleListPage
      title="Eventos"
      tableName="events"
      mockData={mockEvents as unknown as Record<string, unknown>[]}
      filters={filters}
      cardRenderer={(item) => <EventPreviewCard event={item as unknown as Partial<Event>} />}
      createRoute="/eventos/nuevo"
    />
  );
}
