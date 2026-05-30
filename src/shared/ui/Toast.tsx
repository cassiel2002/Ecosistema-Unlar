import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import type { ToastConfig } from '@/shared/types/ui';

interface ToastItem extends ToastConfig {
  id: string;
}

interface ToastContextValue {
  showToast: (config: ToastConfig) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

const typeConfig: Record<
  ToastConfig['type'],
  { icon: React.ReactNode; className: string }
> = {
  success: {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    className: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
  },
  error: {
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    className: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    className: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950',
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    className: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
  },
};

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((config: ToastConfig) => {
    const id = `toast-${++toastCounter}`;
    const duration = config.duration ?? 4000;

    setToasts((prev) => [...prev, { ...config, id }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        aria-label="Notificaciones"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                pointer-events-auto flex w-80 items-start gap-3 rounded-lg border p-4 shadow-lg
                ${typeConfig[toast.type].className}
              `}
              role="alert"
            >
              <span className="mt-0.5 shrink-0">{typeConfig[toast.type].icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:text-gray-300"
                aria-label="Cerrar notificación"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
