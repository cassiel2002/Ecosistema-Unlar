import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Lightbulb,
  HelpCircle,
  BookOpen,
  MapPin,
  GraduationCap,
  Compass,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { Badge } from '@/shared/ui/Badge';

interface CategoryItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const categories: CategoryItem[] = [
  {
    id: 'procedures',
    label: 'Trámites',
    description: 'Cómo inscribirse, documentación necesaria y pasos administrativos',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    id: 'tips',
    label: 'Consejos',
    description: 'Tips de supervivencia universitaria y recomendaciones de estudiantes',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
  },
  {
    id: 'faq',
    label: 'Preguntas Frecuentes',
    description: 'Respuestas a las dudas más comunes de ingresantes',
    icon: <HelpCircle className="h-6 w-6" />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
  },
  {
    id: 'guide',
    label: 'Guías',
    description: 'Materias iniciales, horarios, correlatividades y plan de estudio',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  },
  {
    id: 'campus',
    label: 'Campus',
    description: 'Mapas, ubicaciones de aulas, biblioteca, comedor y espacios comunes',
    icon: <MapPin className="h-6 w-6" />,
    color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  },
];

export function FreshmanPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Blurred background image */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <img
          src="https://mediosrioja.com.ar/wp-content/uploads/2024/07/unlar-1.jpg"
          alt=""
          className="w-full h-full object-cover opacity-[0.25]"
        />
        <div className="absolute inset-0 bg-gray-950/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-8 px-4 py-6">
        {/* Welcome header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
          >
            <GraduationCap className="h-10 w-10 text-primary-600 dark:text-primary-300" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ¡Bienvenido/a a la Universidad! 🎓
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Todo lo que necesitás saber para arrancar tu vida universitaria
          </p>
          {profile?.is_freshman && (
            <Badge variant="success" size="md">
              Modo Ingresante activo
            </Badge>
          )}
        </div>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
          >
            <Compass className="h-5 w-5 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Primeros pasos
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Guía rápida para tu primer día
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
          >
            <Calendar className="h-5 w-5 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Calendario académico
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fechas importantes del cuatrimestre
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/ingresantes/campus')}
            className="flex items-center gap-3 rounded-xl border border-primary-500/35 bg-primary-950/20 hover:bg-primary-900/10 cursor-pointer p-4 transition-all shadow-md"
          >
            <MapPin className="h-5 w-5 text-primary-400" />
            <div>
              <p className="text-sm font-bold text-white">
                Mapa Interactivo 3D
              </p>
              <p className="text-xs text-gray-400">
                Explorá el campus en 3D
              </p>
            </div>
          </motion.div>
        </div>

        {/* Información Institucional REAL de la UNLaR */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 space-y-6"
        >
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🏛️ Sobre la Universidad Nacional de La Rioja
            </h2>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              La <strong>Universidad Nacional de La Rioja (UNLaR)</strong> es una institución pública de educación superior argentina, de carácter autónomo y autárquico. Fue fundada inicialmente en <strong>1972</strong> como la Universidad Provincial de La Rioja y, posteriormente, alcanzando el rango nacional bajo la <strong>Ley Nacional 24.299</strong> en el año <strong>1993</strong>.
            </p>
          </div>

          <div className="border-t border-gray-800/80 pt-5">
            <h3 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-3">
              Departamentos Académicos Oficiales
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              De acuerdo a su estatuto orgánico real, la UNLaR adopta una moderna estructura departamental para la organización de sus carreras de grado y pregrado:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-850 hover:border-primary-500/30 transition-colors">
                <span className="text-xs font-bold text-emerald-400 block mb-1">❤️ Salud</span>
                <span className="text-xs font-semibold text-gray-300">Dpto. de Ciencias de la Salud</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-850 hover:border-primary-500/30 transition-colors">
                <span className="text-xs font-bold text-sky-400 block mb-1">📐 Exactas y Naturales</span>
                <span className="text-xs font-semibold text-gray-300">Dpto. de Ciencias Exactas, Físicas y Naturales</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-850 hover:border-primary-500/30 transition-colors">
                <span className="text-xs font-bold text-purple-400 block mb-1">🧠 Humanas y Educación</span>
                <span className="text-xs font-semibold text-gray-300">Dpto. de Ciencias Humanas y de la Educación</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-850 hover:border-primary-500/30 transition-colors">
                <span className="text-xs font-bold text-amber-400 block mb-1">⚖️ Sociales y Jurídicas</span>
                <span className="text-xs font-semibold text-gray-300">Dpto. de Ciencias Sociales, Jurídicas y Económicas</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-850 hover:border-primary-500/30 transition-colors sm:col-span-2">
                <span className="text-xs font-bold text-red-400 block mb-1">🚜 Producción, Ambiente y Urbanismo</span>
                <span className="text-xs font-semibold text-gray-300">Dpto. de Ciencias y Tecnologías Aplicadas a la Producción, al Ambiente y al Urbanismo</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category navigation */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Explorá por categoría
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => navigate(`/ingresantes/${category.id}`)}
                className="cursor-pointer rounded-xl border border-gray-200 p-5 transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-gray-700"
              >
                <div className={`inline-flex rounded-lg p-2.5 ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">
                  {category.label}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {category.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Helpful sections */}
        <div className="rounded-xl bg-primary-50 p-6 dark:bg-primary-900/20">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ¿No encontrás lo que buscás?
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Preguntá en el foro o contactá al centro de estudiantes. La comunidad está para ayudarte.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/foro')}
              className="min-h-[44px] rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Ir al foro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
