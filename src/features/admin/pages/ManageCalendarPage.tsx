import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Calendar, X, Globe, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { Button } from '@/shared/ui/Button';
import { ModeratorGuard } from '@/core/auth/guards/ModeratorGuard';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { staggerContainer, staggerItem, fadeInScale } from '@/shared/utils/animations';

interface CalendarEventData {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  event_type: 'exam' | 'enrollment' | 'holiday' | 'deadline' | 'other';
  career_ids: string[];
  is_global: boolean;
  created_at: string;
}

interface Career {
  id: string;
  name: string;
  code: string;
}

function ManageCalendarContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CalendarEventData | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    event_type: 'exam' as 'exam' | 'enrollment' | 'holiday' | 'deadline' | 'other',
    is_global: true,
    career_id: '',
  });

  // Fetch calendar events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin', 'calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw new Error(error.message);
      return data as CalendarEventData[];
    },
  });

  // Fetch careers to link to events
  const { data: careers = [] } = useQuery({
    queryKey: ['admin', 'careers-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('careers')
        .select('id, name, code')
        .order('name', { ascending: true });

      if (error) throw new Error(error.message);
      return data as Career[];
    },
  });

  // Add calendar event mutation
  const addMutation = useMutation({
    mutationFn: async (event: typeof newEvent) => {
      if (!user) throw new Error('Debés iniciar sesión');
      const { error } = await supabase.from('calendar_events').insert({
        title: event.title,
        description: event.description ? event.description : null,
        event_date: event.event_date,
        end_date: event.end_date ? event.end_date : null,
        event_type: event.event_type,
        is_global: event.is_global,
        career_ids: event.is_global || !event.career_id ? [] : [event.career_id],
        created_by: user.id,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'calendar-events'] });
      setNewEvent({
        title: '',
        description: '',
        event_date: '',
        end_date: '',
        event_type: 'exam',
        is_global: true,
        career_id: '',
      });
      setShowAddForm(false);
      toast.success('Evento del calendario creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear evento');
    },
  });

  // Delete calendar event mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('calendar_events').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'calendar-events'] });
      setDeleteTarget(null);
      toast.success('Evento eliminado');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar evento');
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.event_date) {
      toast.error('Título y fecha son obligatorios');
      return;
    }
    addMutation.mutate(newEvent);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  const eventTypeLabels = {
    exam: { text: 'Examen', class: 'bg-red-900/30 text-red-300 border-red-800' },
    enrollment: { text: 'Inscripción', class: 'bg-green-900/30 text-green-300 border-green-800' },
    holiday: { text: 'Feriado', class: 'bg-blue-900/30 text-blue-300 border-blue-800' },
    deadline: { text: 'Fecha Límite', class: 'bg-amber-900/30 text-amber-300 border-amber-800' },
    other: { text: 'Otro', class: 'bg-gray-800 text-gray-300 border-gray-700' },
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Gestionar Calendario</h1>
          <p className="mt-1 text-sm text-gray-400">
            Administra las fechas oficiales del calendario académico de la UNLAR
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowAddForm(true)}
        >
          Nuevo Evento
        </Button>
      </motion.div>

      {/* Add Event Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            {...fadeInScale}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Nuevo Evento del Calendario</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label htmlFor="event-title" className="block text-sm font-medium text-gray-300 mb-1">
                  Título del evento
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Inicio de Inscripción a Finales - 1º Turno"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="event-desc" className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  id="event-desc"
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Ej: Inscripciones a través del sistema SIU Guaraní para todas las materias..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="event-type" className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo de fecha
                  </label>
                  <select
                    id="event-type"
                    value={newEvent.event_type}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, event_type: e.target.value as any }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="exam">Examen</option>
                    <option value="enrollment">Inscripción</option>
                    <option value="holiday">Feriado</option>
                    <option value="deadline">Fecha Límite</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="event-date" className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha del evento
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, event_date: e.target.value }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="event-end" className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha de fin (opcional)
                  </label>
                  <input
                    id="event-end"
                    type="date"
                    value={newEvent.end_date}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, end_date: e.target.value }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="event-scope" className="block text-sm font-medium text-gray-300 mb-1">
                    Alcance
                  </label>
                  <select
                    id="event-scope"
                    value={newEvent.is_global ? 'true' : 'false'}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, is_global: e.target.value === 'true' }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="true">Global (Toda la Universidad)</option>
                    <option value="false">Carrera específica</option>
                  </select>
                </div>

                {!newEvent.is_global && (
                  <div>
                    <label htmlFor="event-career" className="block text-sm font-medium text-gray-300 mb-1">
                      Seleccionar carrera
                    </label>
                    <select
                      id="event-career"
                      value={newEvent.career_id}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, career_id: e.target.value }))}
                      className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">-- Seleccionar --</option>
                      {careers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" isLoading={addMutation.isPending}>
                  Crear Evento
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gray-900 border border-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay eventos próximos en el calendario</p>
          <p className="text-sm text-gray-500 mt-1">
            Usa el botón "Nuevo Evento" para agendar las primeras fechas
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {events.map((event) => {
            const dateObj = new Date(event.event_date);
            const formattedDate = dateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
            return (
              <motion.div
                key={event.id}
                variants={staggerItem}
                layout
                className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors animate-fade-in"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-lg bg-gray-800 border border-gray-700 text-white">
                    <span className="text-xs uppercase font-semibold text-primary-400">{dateObj.toLocaleDateString('es-AR', { month: 'short' })}</span>
                    <span className="text-lg font-bold">{dateObj.toLocaleDateString('es-AR', { day: 'numeric' })}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{event.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${eventTypeLabels[event.event_type].class}`}>
                        {eventTypeLabels[event.event_type].text}
                      </span>
                      {event.is_global ? (
                        <span className="text-xs bg-primary-950/40 text-primary-400 border border-primary-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Global
                        </span>
                      ) : (
                        <span className="text-xs bg-purple-950/40 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" /> Especial
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                    )}
                    {event.end_date && (
                      <p className="text-xs text-gray-500 mt-1.5">
                        Rango: {new Date(event.event_date).toLocaleDateString('es-AR')} al {new Date(event.end_date).toLocaleDateString('es-AR')}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setDeleteTarget(event)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                  aria-label={`Eliminar evento`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-sm rounded-xl bg-gray-900 border border-gray-800 p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Eliminar fecha
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                ¿Estás seguro de que querés eliminar el evento{' '}
                <span className="text-white font-medium">"{deleteTarget.title}"</span>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={deleteMutation.isPending}
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ManageCalendarPage() {
  return (
    <ModeratorGuard>
      <ManageCalendarContent />
    </ModeratorGuard>
  );
}
