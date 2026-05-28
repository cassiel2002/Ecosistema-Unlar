import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';

interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
}

interface UseEventRegistrationReturn {
  isRegistered: boolean;
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  isLoading: boolean;
  isMutating: boolean;
  attendeeCount: number;
}

export function useEventRegistration(eventId: string): UseEventRegistrationReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const registrationKey = ['event-registration', eventId, user?.id];
  const attendeesKey = ['event-attendees', eventId];

  // Check if user is registered
  const { data: registration, isLoading } = useQuery({
    queryKey: registrationKey,
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return (data as EventRegistration) ?? null;
    },
    enabled: !!user && !!eventId,
  });

  // Get attendee count
  const { data: attendeeCount = 0 } = useQuery({
    queryKey: attendeesKey,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

      if (error) throw new Error(error.message);
      return count ?? 0;
    },
    enabled: !!eventId,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Debés iniciar sesión para registrarte');

      // Check max attendees
      const { data: event } = await supabase
        .from('events')
        .select('max_attendees, current_attendees')
        .eq('id', eventId)
        .single();

      if (event?.max_attendees && event.current_attendees >= event.max_attendees) {
        throw new Error('El evento está lleno');
      }

      const { error } = await supabase.from('event_registrations').insert({
        user_id: user.id,
        event_id: eventId,
      });

      if (error) throw new Error(error.message);

      // Increment attendee count
      await supabase.rpc('increment_event_attendees', { target_event_id: eventId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationKey });
      queryClient.invalidateQueries({ queryKey: attendeesKey });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Debés iniciar sesión');

      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);

      // Decrement attendee count
      await supabase.rpc('decrement_event_attendees', { target_event_id: eventId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationKey });
      queryClient.invalidateQueries({ queryKey: attendeesKey });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });

  const registerForEvent = useCallback(async () => {
    await registerMutation.mutateAsync();
  }, [registerMutation]);

  const unregisterFromEvent = useCallback(async () => {
    await unregisterMutation.mutateAsync();
  }, [unregisterMutation]);

  return {
    isRegistered: !!registration,
    register: registerForEvent,
    unregister: unregisterFromEvent,
    isLoading,
    isMutating: registerMutation.isPending || unregisterMutation.isPending,
    attendeeCount,
  };
}
