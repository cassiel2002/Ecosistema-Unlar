import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { supabase } from '@/core/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check } from 'lucide-react';
import type { Career } from '@/shared/types';

const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  career_id: z.string().min(1, 'Seleccioná una carrera'),
  enrollment_year: z.number().min(2000).max(new Date().getFullYear()),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCareers, setLoadingCareers] = useState(true);

  // Career search state
  const [careerSearch, setCareerSearch] = useState('');
  const [careerDropdownOpen, setCareerDropdownOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || '',
      enrollment_year: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    supabase
      .from('careers')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setCareers(data as Career[]);
        setLoadingCareers(false);
      });
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
    setIsSubmitting(true);

    const { error } = await supabase.from('user_profiles').insert({
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
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Completá tu perfil</h1>
          <p className="mt-1 text-gray-400">Necesitamos algunos datos para empezar</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5"
        >
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Nombre completo
            </label>
            <input
              {...register('full_name')}
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Tu nombre"
            />
            {errors.full_name && (
              <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>
            )}
          </div>

          {/* Carrera con búsqueda */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Carrera
            </label>
            <input type="hidden" {...register('career_id')} />

            {loadingCareers ? (
              <div className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-gray-500 text-sm">
                Cargando carreras...
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-700 ${
                        selectedCareer?.id === career.id ? 'text-primary-400 bg-primary-900/20' : 'text-white'
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
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Año de ingreso
            </label>
            <input
              type="number"
              {...register('enrollment_year', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || careers.length === 0}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] mt-2"
          >
            {isSubmitting ? 'Guardando...' : 'Comenzar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
