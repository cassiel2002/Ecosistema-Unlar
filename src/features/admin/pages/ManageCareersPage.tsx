import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, GraduationCap, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/core/supabase/client';
import { Button } from '@/shared/ui/Button';
import { ModeratorGuard } from '@/core/auth/guards/ModeratorGuard';
import { staggerContainer, staggerItem, fadeInScale } from '@/shared/utils/animations';

interface Career {
  id: string;
  name: string;
  faculty: string;
  code: string;
  created_at: string;
}

function ManageCareersContent() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null);
  const [newCareer, setNewCareer] = useState({ name: '', faculty: '', code: '' });

  // Fetch careers
  const { data: careers = [], isLoading } = useQuery({
    queryKey: ['admin', 'careers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw new Error(error.message);
      return data as Career[];
    },
  });

  // Add career mutation
  const addMutation = useMutation({
    mutationFn: async (career: { name: string; faculty: string; code: string }) => {
      const { error } = await (supabase.from('careers') as any).insert(career);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'careers'] });
      setNewCareer({ name: '', faculty: '', code: '' });
      setShowAddForm(false);
      toast.success('Carrera creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la carrera');
    },
  });

  // Delete career mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('careers') as any).delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'careers'] });
      setDeleteTarget(null);
      toast.success('Carrera eliminada');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar la carrera');
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCareer.name.trim() || !newCareer.faculty.trim() || !newCareer.code.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    addMutation.mutate(newCareer);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
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
          <h1 className="text-2xl font-bold text-white">Gestionar Carreras</h1>
          <p className="mt-1 text-sm text-gray-400">
            Administra las carreras disponibles en la plataforma
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowAddForm(true)}
        >
          Nueva Carrera
        </Button>
      </motion.div>

      {/* Add Career Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            {...fadeInScale}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Nueva Carrera</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
                aria-label="Cerrar formulario"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label htmlFor="career-name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre de la carrera
                </label>
                <input
                  id="career-name"
                  type="text"
                  value={newCareer.name}
                  onChange={(e) => setNewCareer((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Ingeniería en Sistemas"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="career-faculty" className="block text-sm font-medium text-gray-300 mb-1">
                  Departamento Académico
                </label>
                <select
                  id="career-faculty"
                  value={newCareer.faculty}
                  onChange={(e) => setNewCareer((prev) => ({ ...prev, faculty: e.target.value }))}
                  className="min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">-- Seleccionar Departamento --</option>
                  <option value="Ciencias de la Salud">Ciencias de la Salud</option>
                  <option value="Ciencias Exactas, Físicas y Naturales">Ciencias Exactas, Físicas y Naturales</option>
                  <option value="Ciencias Humanas y de la Educación">Ciencias Humanas y de la Educación</option>
                  <option value="Ciencias Sociales, Jurídicas y Económicas">Ciencias Sociales, Jurídicas y Económicas</option>
                  <option value="Ciencias y Tecnologías Aplicadas a la Producción, al Ambiente y al Urbanismo">Ciencias y Tecnologías Aplicadas a la Producción, al Ambiente y al Urbanismo</option>
                </select>
              </div>
              <div>
                <label htmlFor="career-code" className="block text-sm font-medium text-gray-300 mb-1">
                  Código
                </label>
                <input
                  id="career-code"
                  type="text"
                  value={newCareer.code}
                  onChange={(e) => setNewCareer((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="Ej: ISI"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" isLoading={addMutation.isPending}>
                  Crear Carrera
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Careers List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gray-900 border border-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : careers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <GraduationCap className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay carreras registradas</p>
          <p className="text-sm text-gray-500 mt-1">
            Agrega la primera carrera usando el botón de arriba
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {careers.map((career) => (
            <motion.div
              key={career.id}
              variants={staggerItem}
              layout
              className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900/30 text-primary-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{career.name}</h3>
                  <p className="text-sm text-gray-400">
                    {career.faculty} · <span className="text-gray-500">{career.code}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeleteTarget(career)}
                className="p-2 rounded-lg text-gray-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                aria-label={`Eliminar ${career.name}`}
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
                Eliminar carrera
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                ¿Estás seguro de que querés eliminar{' '}
                <span className="text-white font-medium">{deleteTarget.name}</span>?
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

export function ManageCareersPage() {
  return (
    <ModeratorGuard>
      <ManageCareersContent />
    </ModeratorGuard>
  );
}
