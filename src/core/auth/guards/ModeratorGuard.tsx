import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ModeratorGuardProps {
  children: React.ReactNode;
}

export function ModeratorGuard({ children }: ModeratorGuardProps) {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!profile || (profile.role !== 'moderator' && profile.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
