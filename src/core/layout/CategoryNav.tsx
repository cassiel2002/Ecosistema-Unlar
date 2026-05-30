import { NavLink } from 'react-router-dom';
import {
  Home,
  Building2,
  ShoppingBag,
  MessageSquare,
  PartyPopper,
  Search as SearchIcon,
  Briefcase,
  GraduationCap,
  BookOpen,
  Calendar,
} from 'lucide-react';

const categories = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/alquileres', icon: Building2, label: 'Alquileres' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { to: '/foro', icon: MessageSquare, label: 'Foro' },
  { to: '/perdidos', icon: SearchIcon, label: 'Perdidos' },
  { to: '/servicios', icon: Briefcase, label: 'Servicios' },
  { to: '/clases', icon: GraduationCap, label: 'Clases' },
  { to: '/ingresantes', icon: BookOpen, label: 'Ingresantes' },
  { to: '/calendario', icon: Calendar, label: 'Calendario' },
];

export function CategoryNav() {
  return (
    <nav className="sticky top-16 z-20 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-4 md:px-6 py-2 min-w-max md:justify-center">
          {categories.map((cat) => (
            <NavLink
              key={cat.to}
              to={cat.to}
              end={cat.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`
              }
            >
              <cat.icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
