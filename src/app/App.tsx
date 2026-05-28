import { AuthProvider } from '@/core/auth/components/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AppRouter } from './Router';
import { Toaster } from 'react-hot-toast';

export function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
