import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { supabase } from '@/core/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

const UNLAR_BG = 'https://mediosrioja.com.ar/wp-content/uploads/2024/07/unlar-1.jpg';

/**
 * Mapa de verificación DNI ↔ Matrícula
 *
 * En el futuro, cuando la universidad brinde un listado oficial,
 * esto se reemplaza por una query a una tabla `student_registry` en Supabase.
 */
const STUDENT_REGISTRY: Record<string, string> = {
  // DNI → Matrícula
  '44199722': 'EISI886',        // Cassiel
  '43201301': 'EISI943',        // Córdoba Enzo Nahuel
};

export function VerificationPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [dni, setDni] = useState('');
  const [matricula, setMatricula] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    const cleanDni = dni.trim();
    const cleanMatricula = matricula.trim().toUpperCase();

    if (!cleanDni || !cleanMatricula) {
      setError('Completá ambos campos para continuar.');
      return;
    }

    if (!/^\d{7,8}$/.test(cleanDni)) {
      setError('El DNI debe tener 7 u 8 dígitos numéricos.');
      return;
    }

    // Check against registry
    const expectedMatricula = STUDENT_REGISTRY[cleanDni];

    if (!expectedMatricula) {
      setError('El DNI ingresado no se encuentra en el registro de estudiantes.');
      return;
    }

    if (expectedMatricula !== cleanMatricula) {
      setError('El número de matrícula no coincide con el DNI ingresado.');
      return;
    }

    // Match found! Update user profile
    setIsVerifying(true);

    try {
      if (!user) {
        setError('No se pudo obtener la sesión. Intentá loguearte de nuevo.');
        setIsVerifying(false);
        return;
      }

      const { error: updateError } = await (supabase.from('user_profiles') as any)
        .update({ is_verified: true })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating verification:', updateError);
        setError('Hubo un error al verificar tu cuenta. Intentá nuevamente.');
        setIsVerifying(false);
        return;
      }

      await refreshProfile();
      setSuccess(true);

      // Redirect after a brief success animation
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      console.error('Verification error:', err);
      setError('Error inesperado. Intentá nuevamente.');
      setIsVerifying(false);
    }
  };

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

      {/* ── Floating orbs ── */}
      <div className="absolute top-1/4 -left-24 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Glassmorphism card */}
        <div className="rounded-3xl border border-white/10 bg-gray-950/60 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">

          {/* Top accent stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-indigo-400 to-primary-600" />

          <div className="px-8 pt-8 pb-9">

            {/* ── Icon / Branding ── */}
            <div className="flex flex-col items-center text-center mb-7">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
                className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/50 ring-4 ring-white/10"
              >
                <ShieldCheck className="h-10 w-10 text-white" />
              </motion.div>

              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Verificación Universitaria
              </h1>
              <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">
                Ingresá tu DNI y matrícula para confirmar<br />
                que sos estudiante de la UNLaR
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleVerify} className="space-y-4">

              {/* DNI */}
              <div>
                <label
                  htmlFor="verification-dni"
                  className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
                >
                  DNI
                </label>
                <input
                  id="verification-dni"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => {
                    // Only allow digits
                    const val = e.target.value.replace(/\D/g, '');
                    setDni(val);
                    setError(null);
                  }}
                  placeholder="Ej: 44199722"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  disabled={isVerifying || success}
                />
              </div>

              {/* Matrícula */}
              <div>
                <label
                  htmlFor="verification-matricula"
                  className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
                >
                  Número de Matrícula
                </label>
                <input
                  id="verification-matricula"
                  type="text"
                  maxLength={20}
                  value={matricula}
                  onChange={(e) => {
                    setMatricula(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder="Ej: EISI886"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  disabled={isVerifying || success}
                />
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <p className="text-xs text-emerald-300 font-medium">
                      ¡Verificación exitosa! Redirigiendo...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isVerifying || success || !dni || !matricula}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl
                           bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold
                           hover:from-emerald-400 hover:to-teal-500
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all duration-200 shadow-md shadow-black/30
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-transparent
                           mt-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : success ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Verificado
                  </>
                ) : (
                  'Verificar identidad'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">UNLaR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Footer note */}
            <p className="mt-4 text-[11px] text-center text-gray-500 leading-relaxed">
              Estos datos se validan contra el registro universitario.<br />
              <span className="text-gray-400 font-medium">Tus datos no se almacenan.</span>
            </p>
          </div>
        </div>

        {/* Below-card text */}
        <p className="mt-5 text-[11px] text-center text-white/30">
          Si tenés problemas para verificarte, contactá a la administración.
        </p>
      </motion.div>
    </div>
  );
}
