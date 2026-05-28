import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Megaphone, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { Button } from '@/shared/ui/Button';
import { ModeratorGuard } from '@/core/auth/guards/ModeratorGuard';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { staggerContainer, staggerItem, fadeInScale } from '@/shared/utils/animations';

interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: 'normal' | 'important' | 'urgent';
  source: 'student_center' | 'faculty' | 'community';
  expires_at: string | null;
  created_at: string;
}

function ManageAnnouncementsContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    priority: 'normal' as 'normal' | 'important' | 'urgent',
    source: 'student_center' as 'student_center' | 'faculty' | 'community',
    expires_at: '',
  });

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['admin', 'announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as Announcement[];
    },
  });

  // Add announcement mutation
  const addMutation = useMutation({
    mutationFn: async (announcement: typeof newAnnouncement) => {
      if (!user) throw new Error('Debés iniciar sesión');
      const { error } = await supabase.from('announcements').insert({
        title: announcement.title,
        description: announcement.description,
        priority: announcement.priority,
        source: announcement.source,
        expires_at: announcement.expires_at ? announcement.expires_at : null,
        author_id: user.id,
        image_urls: [],
        status: 'active',
        is_pinned: announcement.priority === 'urgent',
      } as any);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] });
      setNewAnnouncement({
        title: '',
        description: '',
        priority: 'normal',
        source: 'student_center',
        expires_at: '',
      });
      setShowAddForm(false);
      toast.success('Anuncio publicado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al publicar el anuncio');
    },
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] });
      setDeleteTarget(null);
      toast.success('Anuncio eliminado');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el anuncio');
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.description.trim()) {
      toast.error('Título y descripción son obligatorios');
      return;
    }
    addMutation.mutate(newAnnouncement);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  const priorityLabels = {
    normal: { text: 'Normal', class: 'bg-blue-900/30 text-blue-300' },
    important: { text: 'Importante', class: 'bg-amber-900/30 text-amber-300' },
    urgent: { text: 'Urgente', class: 'bg-red-900/30 text-red-300' },
  };

  const sourceLabels = {
    student_center: 'Centro de Estudiantes',
    faculty: 'Facultad / Departamento',
    community: 'Comunidad',
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
          <h1 className="text-2xl font-bold text-white">Gestionar Anuncios</h1>
          <p className="mt-1 text-sm text-gray-400">
            Crea comunicados oficiales y novedades académicas
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowAddForm(true)}
        >
          Nuevo Anuncio
        </Button>
      </motion.div>

      {/* Add Announcement Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            {...fadeInScale}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Nuevo Anuncio</h2>
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
                <label htmlFor="announcement-title" className="block text-sm font-medium text-gray-300 mb-1">
                  Título del anuncio
                </label>
                <input
                  id="announcement-title"
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Suspensión de clases presenciales por desinfección"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="announcement-desc" className="block text-sm font-medium text-gray-300 mb-1">
                  Detalle / Descripción
                </label>
                <textarea
                  id="announcement-desc"
                  rows={4}
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Escribe toda la información relevante aquí..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[100px]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="announcement-priority" className="block text-sm font-medium text-gray-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    id="announcement-priority"
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, priority: e.target.value as any }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Importante</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="announcement-source" className="block text-sm font-medium text-gray-300 mb-1">
                    Origen / Emisor
                  </label>
                  <select
                    id="announcement-source"
                    value={newAnnouncement.source}
                    onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, source: e.target.value as any }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="student_center">Centro de Estudiantes</option>
                    <option value="faculty">Facultad / Dpto</option>
                    <option value="community">Comunidad</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="announcement-expires" className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha de expiración (opcional)
                  </label>
                  <input
                    id="announcement-expires"
                    type="date"
                    value={newAnnouncement.expires_at}
                    onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, expires_at: e.target.value }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" isLoading={addMutation.isPending}>
                  Publicar Anuncio
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcements List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-gray-900 border border-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Megaphone className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay anuncios publicados</p>
          <p className="text-sm text-gray-500 mt-1">
            Usa el botón "Nuevo Anuncio" para publicar el primero
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              variants={staggerItem}
              layout
              className="flex items-start justify-between rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-900/30 text-primary-400 mt-1">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{announcement.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${priorityLabels[announcement.priority].class}`}>
                      {priorityLabels[announcement.priority].text}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                      {sourceLabels[announcement.source]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1.5 whitespace-pre-line leading-relaxed">
                    {announcement.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Publicado: {new Date(announcement.created_at).toLocaleDateString('es-AR')}
                    {announcement.expires_at && ` · Expiración: ${new Date(announcement.expires_at).toLocaleDateString('es-AR')}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeleteTarget(announcement)}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                aria-label={`Eliminar anuncio`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
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
                Eliminar anuncio
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                ¿Estás seguro de que querés eliminar el anuncio{' '}
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

export function ManageAnnouncementsPage() {
  return (
    <ModeratorGuard>
      <ManageAnnouncementsContent />
    </ModeratorGuard>
  );
}
