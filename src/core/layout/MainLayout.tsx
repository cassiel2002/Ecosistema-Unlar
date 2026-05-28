import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { ArrowLeft } from 'lucide-react';

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="pb-6">
        {!isHome && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex min-h-[40px] items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-gray-900/50 hover:bg-gray-800 border border-gray-800 px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Atrás</span>
            </button>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
