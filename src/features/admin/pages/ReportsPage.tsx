import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X, Eye } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ModeratorGuard } from '@/core/auth/guards/ModeratorGuard';
import { useModeration } from '../hooks/useModeration';
import type { Report } from '@/shared/types';
import toast from 'react-hot-toast';

const reasonLabels: Record<Report['reason'], string> = {
  spam: 'Spam',
  inappropriate: 'Contenido inapropiado',
  scam: 'Estafa',
  harassment: 'Acoso',
  other: 'Otro',
};

const targetTypeLabels: Record<string, string> = {
  listing: 'Publicación',
  comment: 'Comentario',
  user: 'Usuario',
};

function ReportsContent() {
  const { pendingReports, resolveReport, isLoading } = useModeration();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleResolve = async (reportId: string, action: 'dismiss' | 'warn' | 'remove') => {
    setProcessingId(reportId);
    try {
      await resolveReport(reportId, action);
      const actionLabel = action === 'dismiss' ? 'descartado' : action === 'remove' ? 'eliminado' : 'advertido';
      toast.success(`Reporte ${actionLabel} correctamente`);
    } catch {
      toast.error('Error al procesar el reporte');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Skeleton variant="text" height={32} className="w-48" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={120} className="w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Reportes Pendientes
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {pendingReports.length} reporte{pendingReports.length !== 1 ? 's' : ''} por revisar
        </p>
      </div>

      {/* Reports list */}
      {pendingReports.length === 0 ? (
        <EmptyState
          title="Sin reportes pendientes"
          description="No hay reportes que requieran atención en este momento."
          icon={<Check className="h-12 w-12 text-green-400" />}
        />
      ) : (
        <div className="space-y-3">
          {pendingReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-full p-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {reasonLabels[report.reason]}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          {targetTypeLabels[report.target_type] ?? report.target_type}
                        </span>
                      </div>
                      {report.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {report.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Reportado el {new Date(report.created_at).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap gap-2 pl-11">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleResolve(report.id, 'remove')}
                    isLoading={processingId === report.id}
                    disabled={!!processingId}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Eliminar contenido
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleResolve(report.id, 'warn')}
                    isLoading={processingId === report.id}
                    disabled={!!processingId}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Advertir
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResolve(report.id, 'dismiss')}
                    isLoading={processingId === report.id}
                    disabled={!!processingId}
                  >
                    Descartar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReportsPage() {
  return (
    <ModeratorGuard>
      <ReportsContent />
    </ModeratorGuard>
  );
}
