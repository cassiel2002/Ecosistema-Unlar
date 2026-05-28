import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ModeratorGuard } from '@/core/auth/guards/ModeratorGuard';
import { useModeration } from '../hooks/useModeration';

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const { stats, pendingReports, isLoading } = useModeration();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <Skeleton variant="text" height={32} className="w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={100} className="rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Panel de Moderación
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestión de reportes y contenido de la plataforma
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard
            label="Reportes totales"
            value={stats.totalReports}
            icon={AlertTriangle}
            color="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard
            label="Pendientes"
            value={stats.pendingReports}
            icon={Clock}
            color="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard
            label="Resueltos hoy"
            value={stats.resolvedToday}
            icon={CheckCircle}
            color="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard
            label="Publicaciones activas"
            value={stats.activeListings}
            icon={FileText}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
          />
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Acciones rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/reportes"
            className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Ver reportes pendientes ({stats.pendingReports})
          </Link>
          <Link
            to="/admin/carreras"
            className="px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
          >
            Carreras
          </Link>
          <Link
            to="/admin/anuncios"
            className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            Anuncios
          </Link>
          <Link
            to="/admin/calendario"
            className="px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
          >
            Calendario
          </Link>
          <Link
            to="/admin/ingresantes"
            className="px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            Guías de Ingresantes
          </Link>
        </div>
      </div>

      {/* Recent pending reports preview */}
      {pendingReports.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Reportes recientes
            </h2>
            <Link
              to="/admin/reportes"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {pendingReports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {report.reason} — {report.target_type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(report.created_at).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDashboardPage() {
  return (
    <ModeratorGuard>
      <AdminDashboardContent />
    </ModeratorGuard>
  );
}
