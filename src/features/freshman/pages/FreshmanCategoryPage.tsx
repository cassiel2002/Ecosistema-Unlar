import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { GuideCard, type FreshmanGuide } from '../components/GuideCard';
import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { CampusMap3D } from '../components/CampusMap3D';

const categoryTitles: Record<string, string> = {
  procedures: 'Trámites',
  tips: 'Consejos',
  faq: 'Preguntas Frecuentes',
  guide: 'Guías',
  campus: 'Campus',
};

const categoryDescriptions: Record<string, string> = {
  procedures: 'Información sobre inscripciones, documentación y pasos administrativos',
  tips: 'Consejos de supervivencia universitaria de estudiantes avanzados',
  faq: 'Respuestas a las preguntas más comunes de ingresantes',
  guide: 'Guías sobre materias, horarios y plan de estudio',
  campus: 'Mapas, ubicaciones y espacios del campus',
};

export function FreshmanCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedGuide, setSelectedGuide] = useState<FreshmanGuide | null>(null);

  const { data: guides = [], isLoading } = useQuery({
    queryKey: ['freshman-guides', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('freshman_guides')
        .select('*')
        .eq('category', category!)
        .order('order_index', { ascending: true });

      if (error) throw new Error(error.message);
      return (data as FreshmanGuide[]) ?? [];
    },
    enabled: !!category,
  });

  // Filter career-specific guides to matching users only
  const filteredGuides = guides.filter((guide) => {
    if (!guide.career_id) return true; // Global guides visible to all
    if (!profile?.career_id) return true; // Show all if user has no career set
    return guide.career_id === profile.career_id;
  });

  const title = categoryTitles[category ?? ''] ?? 'Guías';
  const description = categoryDescriptions[category ?? ''] ?? '';

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/ingresantes')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al hub ingresantes
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Render the 3D Interactive Campus Map if category is campus */}
      {category === 'campus' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <CampusMap3D />
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} className="w-full rounded-xl" />
          ))}
        </div>
      ) : filteredGuides.length === 0 ? (
        category === 'campus' ? null : (
          <EmptyState
            title="No hay guías disponibles"
            description="Aún no se publicaron guías en esta categoría."
          />
        )
      ) : (
        <div className="space-y-3">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <GuideCard
                guide={guide}
                onClick={() => setSelectedGuide(guide)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Guide detail modal */}
      <Modal
        isOpen={!!selectedGuide}
        onClose={() => setSelectedGuide(null)}
        title={selectedGuide?.title ?? ''}
        size="lg"
      >
        {selectedGuide && (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">
              {selectedGuide.content}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
