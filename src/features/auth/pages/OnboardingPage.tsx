import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { supabase } from '@/core/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, LogOut } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import type { Career } from '@/shared/types';

const UNLAR_BG = 'https://mediosrioja.com.ar/wp-content/uploads/2024/07/unlar-1.jpg';

const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  dni: z.string().min(7, 'DNI inválido').max(10),
  matricula: z.string().optional().or(z.literal('')),
  career_id: z.string().min(1, 'Seleccioná una carrera'),
  enrollment_year: z.number().min(2000).max(new Date().getFullYear()),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export function OnboardingPage() {
  const { user, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Career search state
  const [careerSearch, setCareerSearch] = useState('');
  const [careerDropdownOpen, setCareerDropdownOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [captchaToken, setCaptchaToken] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || '',
      dni: sessionStorage.getItem('pending_dni') || '',
      matricula: sessionStorage.getItem('pending_matricula') || '',
      enrollment_year: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const { data, error } = await supabase
          .from('careers')
          .select('*')
          .order('name');
          
        if (error) {
          console.error("Error al cargar carreras:", error);
        }
        if (data) setCareers(data as Career[]);
      } catch (err) {
        console.error("Error de red al cargar carreras:", err);
      } finally {
        setLoadingCareers(false);
      }
    };
    
    fetchCareers();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCareerDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCareers = careers.filter((c) =>
    c.name.toLowerCase().includes(careerSearch.toLowerCase())
  );

  const handleCareerSelect = (career: Career) => {
    setSelectedCareer(career);
    setValue('career_id', career.id);
    setCareerSearch(career.name);
    setCareerDropdownOpen(false);
  };

  const onSubmit = async (data: OnboardingForm) => {
    if (!user) return;
    setValidationError(null);
    setIsSubmitting(true);

    const { error } = await (supabase.from('user_profiles') as any).upsert({
      id: user.id,
      email: user.email!,
      full_name: data.full_name,
      career_id: data.career_id,
      enrollment_year: data.enrollment_year,
      avatar_url: user.user_metadata?.avatar_url || null,
    });

    if (!error) {
      await refreshProfile();
      navigate('/', { replace: true });
    } else {
      console.error("Error al guardar perfil:", error);
      setValidationError("Error al guardar el perfil: " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleSignOut = () => {
    // Force clear Supabase local storage to guarantee session wipe
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key);
      }
    }
    
    // Fire and forget the Supabase API call
    signOut().catch(console.error);

    // Hard redirect
    window.location.href = `${import.meta.env.BASE_URL}auth/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950 px-4">
      {/* ── Background image ── */}
      <div className="absolute inset-0">
        <img
          src={UNLAR_BG}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/80 to-gray-950/95" />
        <div className="absolute inset-0 bg-primary-950/20" />
      </div>

      {/* ── Floating orbs for depth ── */}
      <div className="absolute top-1/4 -left-24 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── Logout Button (Top Left) ── */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/60 backdrop-blur-md border border-gray-700 hover:bg-gray-800 rounded-xl text-gray-300 hover:text-white transition-all shadow-lg text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative z-10 my-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Completá tu perfil</h1>
          <p className="mt-1 text-gray-300 drop-shadow">Necesitamos algunos datos para empezar</p>
        </div>

        {validationError && (
          <div className="mb-6 p-4 bg-red-900/80 backdrop-blur-md border border-red-500/50 rounded-xl flex items-start gap-3 shadow-xl">
            <span className="text-red-300 mt-0.5">⚠️</span>
            <p className="text-sm text-red-100 leading-relaxed font-medium">{validationError}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-7 shadow-2xl space-y-5 shadow-black/50"
        >
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Nombre completo
            </label>
            <input
              {...register('full_name')}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="Tu nombre"
            />
            {errors.full_name && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.full_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                DNI
              </label>
              <input
                {...register('dni')}
                type="text"
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Ej: 44199722"
              />
              {errors.dni && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.dni.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Matrícula
              </label>
              <input
                {...register('matricula')}
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none uppercase transition-all duration-200"
                placeholder="Ej: EISI886"
              />
              {errors.matricula && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.matricula.message}</p>}
            </div>
          </div>

          {/* Carrera con búsqueda */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Carrera
            </label>
            <input type="hidden" {...register('career_id')} />

            {loadingCareers ? (
              <div className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-sm">
                Cargando carreras...
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={careerSearch}
                  onChange={(e) => {
                    setCareerSearch(e.target.value);
                    setCareerDropdownOpen(true);
                    if (!e.target.value) {
                      setSelectedCareer(null);
                      setValue('career_id', '');
                    }
                  }}
                  onFocus={() => setCareerDropdownOpen(true)}
                  placeholder="Buscá tu carrera..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            )}

            {/* Dropdown */}
            <AnimatePresence>
              {careerDropdownOpen && filteredCareers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 shadow-xl"
                >
                  {filteredCareers.map((career) => (
                    <button
                      key={career.id}
                      type="button"
                      onClick={() => handleCareerSelect(career)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-700 ${selectedCareer?.id === career.id ? 'text-primary-400 bg-primary-900/20' : 'text-white'
                        }`}
                    >
                      {selectedCareer?.id === career.id && <Check className="h-4 w-4 flex-shrink-0" />}
                      <span className={selectedCareer?.id === career.id ? '' : 'pl-6'}>{career.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
              {careerDropdownOpen && careerSearch.length > 0 && filteredCareers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-20 mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3"
                >
                  <p className="text-sm text-gray-500">No se encontró esa carrera</p>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.career_id && (
              <p className="mt-1 text-xs text-red-400">{errors.career_id.message}</p>
            )}
          </div>

          {/* Año de ingreso */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Año de ingreso
            </label>
            <input
              type="number"
              {...register('enrollment_year', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Captcha */}
          <div className="flex justify-center pt-2">
            <HCaptcha
              sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY || ''}
              onVerify={setCaptchaToken}
              theme="dark"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || careers.length === 0 || !captchaToken}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] mt-2 shadow-lg shadow-primary-900/30 active:scale-[0.98]"
          >
            {isSubmitting ? 'Guardando...' : 'Completar y Entrar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
