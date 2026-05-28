import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, BookOpen, X, Globe, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { Button } from '@/shared/ui/Button';
import { ModeratorGuard } from '@/core/auth/guards/ModeratorGuard';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { staggerContainer, staggerItem, fadeInScale } from '@/shared/utils/animations';

interface FreshmanGuide {
  id: string;
  title: string;
  content: string;
  category: 'procedures' | 'tips' | 'faq' | 'guide' | 'campus';
  order_index: number;
  career_id: string | null;
  created_at: string;
}

interface Career {
  id: string;
  name: string;
  code: string;
}

function ManageFreshmanGuidesContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FreshmanGuide | null>(null);
  const [newGuide, setNewGuide] = useState({
    title: '',
    content: '',
    category: 'procedures' as 'procedures' | 'tips' | 'faq' | 'guide' | 'campus',
    order_index: 0,
    career_id: '',
  });

  // Fetch freshman guides
  const { data: guides = [], isLoading } = useQuery({
    queryKey: ['admin', 'freshman-guides-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('freshman_guides')
        .select('*')
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw new Error(error.message);
      return data as FreshmanGuide[];
    },
  });

  // Fetch careers to link to guides
  const { data: careers = [] } = useQuery({
    queryKey: ['admin', 'careers-list-guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('careers')
        .select('id, name, code')
        .order('name', { ascending: true });

      if (error) throw new Error(error.message);
      return data as Career[];
    },
  });

  // Add freshman guide mutation
  const addMutation = useMutation({
    mutationFn: async (guide: typeof newGuide) => {
      if (!user) throw new Error('Debés iniciar sesión');
      const { error } = await supabase.from('freshman_guides').insert({
        title: guide.title,
        content: guide.content,
        category: guide.category,
        order_index: Number(guide.order_index),
        career_id: guide.career_id ? guide.career_id : null,
        author_id: user.id,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'freshman-guides-list'] });
      setNewGuide({
        title: '',
        content: '',
        category: 'procedures',
        order_index: 0,
        career_id: '',
      });
      setShowAddForm(false);
      toast.success('Guía para ingresantes creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la guía');
    },
  });

  // Delete freshman guide mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('freshman_guides').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'freshman-guides-list'] });
      setDeleteTarget(null);
      toast.success('Guía eliminada');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar la guía');
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuide.title.trim() || !newGuide.content.trim()) {
      toast.error('Título y contenido son obligatorios');
      return;
    }
    addMutation.mutate(newGuide);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  const categoryLabels = {
    procedures: { text: 'Trámites', class: 'bg-blue-900/30 text-blue-300' },
    tips: { text: 'Consejos', class: 'bg-amber-900/30 text-amber-300' },
    faq: { text: 'FAQ', class: 'bg-purple-900/30 text-purple-300' },
    guide: { text: 'Guía', class: 'bg-green-900/30 text-green-300' },
    campus: { text: 'Campus', class: 'bg-red-900/30 text-red-300' },
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
          <h1 className="text-2xl font-bold text-white">Gestionar Guías</h1>
          <p className="mt-1 text-sm text-gray-400">
            Administra los recursos informativos del Hub de Ingresantes
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowAddForm(true)}
        >
          Nueva Guía
        </Button>
      </motion.div>

      {/* Add Guide Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            {...fadeInScale}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Nueva Guía / Tip de Ingreso</h2>
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
                <label htmlFor="guide-title" className="block text-sm font-medium text-gray-300 mb-1">
                  Título de la guía
                </label>
                <input
                  id="guide-title"
                  type="text"
                  value={newGuide.title}
                  onChange={(e) => setNewGuide((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Cómo tramitar el Boleto Estudiantil Gratuito"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="guide-content" className="block text-sm font-medium text-gray-300 mb-1">
                  Contenido informativo
                </label>
                <textarea
                  id="guide-content"
                  rows={6}
                  value={newGuide.content}
                  onChange={(e) => setNewGuide((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Desarrolla toda la guía paso a paso aquí. Puedes escribir párrafos completos..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[150px]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="guide-category" className="block text-sm font-medium text-gray-300 mb-1">
                    Categoría
                  </label>
                  <select
                    id="guide-category"
                    value={newGuide.category}
                    onChange={(e) => setNewGuide((prev) => ({ ...prev, category: e.target.value as any }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="procedures">Trámites</option>
                    <option value="tips">Consejos</option>
                    <option value="faq">Preguntas Frecuentes</option>
                    <option value="guide">Guías</option>
                    <option value="campus">Campus</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="guide-index" className="block text-sm font-medium text-gray-300 mb-1">
                    Orden de Visualización
                  </label>
                  <input
                    id="guide-index"
                    type="number"
                    value={newGuide.order_index}
                    onChange={(e) => setNewGuide((prev) => ({ ...prev, order_index: Number(e.target.value) }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="guide-career" className="block text-sm font-medium text-gray-300 mb-1">
                    Carrera destinataria (opcional)
                  </label>
                  <select
                    id="guide-career"
                    value={newGuide.career_id}
                    onChange={(e) => setNewGuide((prev) => ({ ...prev, career_id: e.target.value }))}
                    className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">-- Global (Todas las carreras) --</option>
                    {careers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" isLoading={addMutation.isPending}>
                  Crear Guía
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guides List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gray-900 border border-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : guides.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay guías creadas todavía</p>
          <p className="text-sm text-gray-500 mt-1">
            Usa el botón "Nueva Guía" para publicar la primera información
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {guides.map((guide) => (
            <motion.div
              key={guide.id}
              variants={staggerItem}
              layout
              className="flex items-start justify-between rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors animate-fade-in"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-900/30 text-primary-400 mt-1">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{guide.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryLabels[guide.category].class}`}>
                      {categoryLabels[guide.category].text}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                      Orden: {guide.order_index}
                    </span>
                    {guide.career_id ? (
                      <span className="text-xs bg-purple-950/40 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" /> Especial
                      </span>
                    ) : (
                      <span className="text-xs bg-primary-950/40 text-primary-400 border border-primary-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Globe className="h-3 w-3" /> Global
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-3 whitespace-pre-line leading-relaxed">
                    {guide.content}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeleteTarget(guide)}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                aria-label={`Eliminar guía`}
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
                Eliminar guía
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                ¿Estás seguro de que querés eliminar la guía{' '}
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

export function ManageFreshmanGuidesPage() {
  return (
    <ModeratorGuard>
      <ManageFreshmanGuidesContent />
    </ModeratorGuard>
  );
}
