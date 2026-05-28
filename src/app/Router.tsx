import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/core/layout/MainLayout';
import { AuthGuard } from '@/core/auth/guards/AuthGuard';
import { ModeratorGuard } from '@/core/auth/guards/ModeratorGuard';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { AuthCallbackPage } from '@/features/auth/pages/AuthCallbackPage';
import { OnboardingPage } from '@/features/auth/pages/OnboardingPage';
import { ManageCareersPage } from '@/features/admin/pages/ManageCareersPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { RentalsPage } from '@/features/rentals/pages/RentalsPage';
import { CreateRentalPage } from '@/features/rentals/pages/CreateRentalPage';
import { RentalDetailPage } from '@/features/rentals/pages/RentalDetailPage';
import { MarketplacePage } from '@/features/marketplace/pages/MarketplacePage';
import { CreateMarketplaceItemPage } from '@/features/marketplace/pages/CreateMarketplaceItemPage';
import { MarketplaceDetailPage } from '@/features/marketplace/pages/MarketplaceDetailPage';
import { ForumPage } from '@/features/forum/pages/ForumPage';
import { CreateForumPostPage } from '@/features/forum/pages/CreateForumPostPage';
import { ForumPostPage } from '@/features/forum/pages/ForumPostPage';
import { LostFoundPage } from '@/features/lost-found/pages/LostFoundPage';
import { CreateLostFoundPage } from '@/features/lost-found/pages/CreateLostFoundPage';
import { LostFoundDetailPage } from '@/features/lost-found/pages/LostFoundDetailPage';
import { AnnouncementsPage } from '@/features/announcements/pages/AnnouncementsPage';
import { AnnouncementDetailPage } from '@/features/announcements/pages/AnnouncementDetailPage';
import { EventsPage } from '@/features/events/pages/EventsPage';
import { CreateEventPage } from '@/features/events/pages/CreateEventPage';
import { EventDetailPage } from '@/features/events/pages/EventDetailPage';
import { ServicesPage } from '@/features/services/pages/ServicesPage';
import { CreateServicePage } from '@/features/services/pages/CreateServicePage';
import { ServiceDetailPage } from '@/features/services/pages/ServiceDetailPage';
import { TutoringPage } from '@/features/tutoring/pages/TutoringPage';
import { CreateTutoringPage } from '@/features/tutoring/pages/CreateTutoringPage';
import { TutoringDetailPage } from '@/features/tutoring/pages/TutoringDetailPage';
import { FreshmanPage } from '@/features/freshman/pages/FreshmanPage';
import { FreshmanCategoryPage } from '@/features/freshman/pages/FreshmanCategoryPage';
import { CalendarPage } from '@/features/calendar/pages/CalendarPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { EditProfilePage } from '@/features/profile/pages/EditProfilePage';
import { FavoritesPage } from '@/features/profile/pages/FavoritesPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { SearchPage } from '@/features/search/pages/SearchPage';
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { ReportsPage } from '@/features/admin/pages/ReportsPage';
import { ManageAnnouncementsPage } from '@/features/admin/pages/ManageAnnouncementsPage';
import { ManageCalendarPage } from '@/features/admin/pages/ManageCalendarPage';
import { ManageFreshmanGuidesPage } from '@/features/admin/pages/ManageFreshmanGuidesPage';

// Placeholder page component for pages still needing simple stubs
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">Próximamente</p>
      </div>
    </div>
  );
}

function ManageUsersPage() {
  return <PlaceholderPage title="Gestionar Usuarios" />;
}

function NotFoundPage() {
  return <PlaceholderPage title="404 - Página no encontrada" />;
}

// Auth layout
function AuthLayout() {
  return <LoginPage />;
}

// Admin layout
function AdminLayout() {
  return (
    <ModeratorGuard>
      <MainLayout />
    </ModeratorGuard>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'alquileres', element: <RentalsPage /> },
      { path: 'alquileres/:id', element: <RentalDetailPage /> },
      { path: 'alquileres/nuevo', element: <CreateRentalPage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'marketplace/:id', element: <MarketplaceDetailPage /> },
      { path: 'marketplace/nuevo', element: <CreateMarketplaceItemPage /> },
      { path: 'foro', element: <ForumPage /> },
      { path: 'foro/:id', element: <ForumPostPage /> },
      { path: 'foro/nuevo', element: <CreateForumPostPage /> },
      { path: 'perdidos', element: <LostFoundPage /> },
      { path: 'perdidos/:id', element: <LostFoundDetailPage /> },
      { path: 'perdidos/nuevo', element: <CreateLostFoundPage /> },
      { path: 'anuncios', element: <AnnouncementsPage /> },
      { path: 'anuncios/:id', element: <AnnouncementDetailPage /> },
      { path: 'eventos', element: <EventsPage /> },
      { path: 'eventos/:id', element: <EventDetailPage /> },
      { path: 'eventos/nuevo', element: <CreateEventPage /> },
      { path: 'servicios', element: <ServicesPage /> },
      { path: 'servicios/:id', element: <ServiceDetailPage /> },
      { path: 'servicios/nuevo', element: <CreateServicePage /> },
      { path: 'clases', element: <TutoringPage /> },
      { path: 'clases/:id', element: <TutoringDetailPage /> },
      { path: 'clases/nuevo', element: <CreateTutoringPage /> },
      { path: 'ingresantes', element: <FreshmanPage /> },
      { path: 'ingresantes/:category', element: <FreshmanCategoryPage /> },
      { path: 'calendario', element: <CalendarPage /> },
      { path: 'perfil/:id', element: <ProfilePage /> },
      { path: 'perfil/editar', element: <EditProfilePage /> },
      { path: 'favoritos', element: <FavoritesPage /> },
      { path: 'notificaciones', element: <NotificationsPage /> },
      { path: 'buscar', element: <SearchPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'reportes', element: <ReportsPage /> },
      { path: 'anuncios', element: <ManageAnnouncementsPage /> },
      { path: 'usuarios', element: <ManageUsersPage /> },
      { path: 'calendario', element: <ManageCalendarPage /> },
      { path: 'ingresantes', element: <ManageFreshmanGuidesPage /> },
      { path: 'carreras', element: <ManageCareersPage /> },
    ],
  },
  {
    path: '/auth',
    children: [
      { path: 'login', element: <AuthLayout /> },
      { path: 'callback', element: <AuthCallbackPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
