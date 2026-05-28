import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/core/supabase/client';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          navigate('/', { replace: true });
        } else {
          navigate('/auth/onboarding', { replace: true });
        }
      } else {
        navigate('/auth/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Procesando autenticación...</p>
      </div>
    </div>
  );
}
