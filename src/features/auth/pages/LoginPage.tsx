import { useAuth } from '@/core/auth/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UNLAR_BG = 'https://mediosrioja.com.ar/wp-content/uploads/2024/07/unlar-1.jpg';

export function LoginPage() {
  const { isAuthenticated, isLoading, signInWithGoogle } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* ── Background image ── */}
      <div className="absolute inset-0">
        <img
          src={UNLAR_BG}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/60 to-gray-950/85" />
        <div className="absolute inset-0 bg-primary-950/30" />
      </div>

      {/* ── Floating orbs for depth ── */}
      <div className="absolute top-1/4 -left-24 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="rounded-3xl border border-white/10 bg-gray-950/60 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-indigo-400 to-primary-600" />

          <div className="px-8 pt-8 pb-9">
            {/* ── Logo / Branding ── */}
            <div className="flex flex-col items-center text-center mb-8">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
                className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-900/50 ring-4 ring-white/10"
              >
                <span className="text-2xl font-black tracking-tight text-white select-none">
                  UN<span className="text-primary-200">La</span>R
                </span>
              </motion.div>

              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Ecosistema UNLaR
              </h1>
              <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">
                Tu comunidad universitaria en un solo lugar
              </p>
            </div>

            {/* ── Sign-in button ── */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl
                         bg-white text-gray-900 text-sm font-semibold
                         hover:bg-gray-100 active:scale-[0.98]
                         transition-all duration-200 shadow-md shadow-black/30
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-transparent
                         group"
            >
              <svg className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar con Google
            </motion.button>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">UNLaR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="mt-4 text-[11px] text-center text-gray-500 leading-relaxed">
              Plataforma exclusiva para estudiantes de la<br />
              <span className="text-gray-400 font-medium">Universidad Nacional de La Rioja</span>
            </p>
          </div>
        </div>

        <p className="mt-5 text-[11px] text-center text-white/30">
          Al continuar, aceptás los términos de uso de la plataforma.
        </p>
      </motion.div>
    </div>
  );
}
