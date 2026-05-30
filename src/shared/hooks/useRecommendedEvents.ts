import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { Event } from '@/shared/types';

export function useRecommendedEvents() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['recommended-events', user?.id],
    queryFn: async (): Promise<Event[]> => {
      if (!user) return [];
      
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        console.warn('VITE_API_URL no está configurada. No se pueden obtener recomendaciones.');
        return [];
      }

      try {
        const response = await fetch(`${apiUrl}/api/recommendations/events/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // El backend de Facu requiere este header provisorio
            'X-User-Id': user.id,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener recomendaciones');
        }

        const data = await response.json();
        // El backend devuelve { recommendations: Event[] } o Event[] directamente
        return Array.isArray(data) ? data : data.recommendations || [];
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
