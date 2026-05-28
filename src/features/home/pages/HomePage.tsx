import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  ShoppingBag,
  MessageSquare,
  Search as SearchIcon,
  PartyPopper,
  Briefcase,
  GraduationCap,
  BookOpen,
  Calendar,
  Plus,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { supabase } from '@/core/supabase/client';
import { Modal } from '@/shared/ui/Modal';
import { CampusMap3D } from '@/features/freshman/components/CampusMap3D';
import {
  mockRentals,
  mockMarketplaceItems,
  mockForumPosts,
  mockEvents,
  mockLostFound,
  mockServices,
  mockTutoring,
} from '@/shared/constants/mockData';
import { RentalPreviewCard } from '../components/RentalPreviewCard';
import { MarketplacePreviewCard } from '../components/MarketplacePreviewCard';
import { ForumPreviewCard } from '../components/ForumPreviewCard';
import { EventPreviewCard } from '../components/EventPreviewCard';
import { GenericPreviewCard } from '../components/GenericPreviewCard';

// ============================================
// Zone Filter Config (only shown for Alquileres)
// ============================================
const ZONE_FILTERS = [
  {
    id: 'all',
    label: 'Todas las zonas',
    icon: '🗺️',
    neighborhoods: null, // null = no filter
  },
  {
    id: 'centro',
    label: 'Zona Centro',
    icon: '🏙️',
    neighborhoods: ['Centro', 'Barrio Residencial', 'Barrio Centro'],
  },
  {
    id: 'norte',
    label: 'Zona Norte',
    icon: '🏘️',
    neighborhoods: ['Barrio Norte', 'Norte', 'Villa del Parque'],
  },
  {
    id: 'unlar',
    label: 'UNLaR / C. Univ.',
    icon: '🎓',
    neighborhoods: ['Ciudad Universitaria', 'UNLAR', 'Campus'],
  },
] as const;

type ZoneId = (typeof ZONE_FILTERS)[number]['id'];

// ============================================
// Tab Configuration
// ============================================
const tabs = [
  { id: 'alquileres', label: 'Alquileres', icon: Building2, route: '/alquileres', table: 'rentals', createRoute: '/alquileres/nuevo' },
  { id: 'marketplace', label: 'Compra/Venta', icon: ShoppingBag, route: '/marketplace', table: 'marketplace_items', createRoute: '/marketplace/nuevo' },
  { id: 'foro', label: 'Foro', icon: MessageSquare, route: '/foro', table: 'forum_posts', createRoute: '/foro/nuevo' },
  { id: 'perdidos', label: 'Perdidos', icon: SearchIcon, route: '/perdidos', table: 'lost_found_items', createRoute: '/perdidos/nuevo' },
  { id: 'eventos', label: 'Eventos', icon: PartyPopper, route: '/eventos', table: 'events', createRoute: '/eventos/nuevo' },
  { id: 'servicios', label: 'Servicios', icon: Briefcase, route: '/servicios', table: 'services', createRoute: '/servicios/nuevo' },
  { id: 'clases', label: 'Clases', icon: GraduationCap, route: '/clases', table: 'tutoring_listings', createRoute: '/clases/nuevo' },
  { id: 'ingresantes', label: 'Ingresantes', icon: BookOpen, route: '/ingresantes', table: null, createRoute: null },
  { id: 'calendario', label: 'Calendario', icon: Calendar, route: '/calendario', table: null, createRoute: null },
] as const;

type TabId = (typeof tabs)[number]['id'];

// ============================================
// Data Fetching Hook
// ============================================
function useTabData(tabId: TabId) {
  const tab = tabs.find((t) => t.id === tabId);
  const tableName = tab?.table;

  return useQuery({
    queryKey: ['home-tab', tabId],
    queryFn: async () => {
      if (!tableName) return [];
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    },
    enabled: !!tableName,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ============================================
// Quick Campus References for Sidebar
// ============================================
const QUICK_CAMPUS_REFS = [
  { id: '1', label: '1', type: 'numeric', name: 'Área Administrativa 1 (Rectorado)' },
  { id: '2', label: '2', type: 'numeric', name: 'Área Administrativa 2' },
  { id: '3', label: '3', type: 'numeric', name: 'Área Administrativa 3' },
  { id: '4', label: '4', type: 'numeric', name: 'Dpto. Sociales / Salud' },
  { id: '5', label: '5', type: 'numeric', name: 'Dpto. Exactas / Aplicadas' },
  { id: '6', label: '6', type: 'numeric', name: 'Dpto. Humanidades' },
  { id: '7', label: '7', type: 'numeric', name: 'Museo de Ciencias Naturales' },
  { id: '8', label: '8', type: 'numeric', name: 'Microcine' },
  { id: '9', label: '9', type: 'numeric', name: 'Biblioteca' },
  { id: '10', label: '10', type: 'numeric', name: 'Oficina de Alumnos - SIU' },
  { id: '11', label: '11', type: 'numeric', name: 'Comedor Universitario' },
  { id: '12', label: '12', type: 'numeric', name: 'CUERDA' },
  { id: '13', label: '13', type: 'numeric', name: 'Colegio Pre Universitario' },
  { id: '14', label: '14', type: 'numeric', name: 'Multimedios UNLaR' },
  { id: '15', label: '15', type: 'numeric', name: 'Gimnasio' },
  { id: '16', label: '16', type: 'numeric', name: 'Residencia Docente' },
  { id: 'A', label: 'A', type: 'letter', name: 'Módulo Áulico "A"' },
  { id: 'B', label: 'B', type: 'letter', name: 'Módulo Áulico "B"' },
  { id: 'C', label: 'C', type: 'letter', name: 'Módulo Áulico "C"' },
  { id: 'D', label: 'D', type: 'letter', name: 'Módulo Áulico "D"' },
  { id: 'E', label: 'E', type: 'letter', name: 'Módulo Áulico - CIIPRA' },
];

// ============================================
// HomePage Component
// ============================================
export function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('alquileres');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeZone, setActiveZone] = useState<ZoneId>('all');
  const navigate = useNavigate();
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const { data: tabData, isLoading } = useTabData(activeTab);
  const activeTabConfig = tabs.find((t) => t.id === activeTab)!;

  // Update indicator position
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tabEl = activeTabRef.current;
      const containerEl = tabsRef.current;
      const containerRect = containerEl.getBoundingClientRect();
      const tabRect = tabEl.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left + containerEl.scrollLeft,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  // Get content to display (real data or mock)
  const rawDisplayData = getDisplayData(activeTab, tabData);

  // Apply zone filter for rentals
  const displayData = (() => {
    if (activeTab !== 'alquileres' || activeZone === 'all') return rawDisplayData;
    const zone = ZONE_FILTERS.find((z) => z.id === activeZone);
    if (!zone || !zone.neighborhoods) return rawDisplayData;
    const allowed = zone.neighborhoods.map((n) => n.toLowerCase());
    return rawDisplayData.filter((item) => {
      const neighborhood = ((item as Record<string, unknown>).neighborhood as string | undefined) ?? '';
      return allowed.some((z) => neighborhood.toLowerCase().includes(z));
    });
  })();

  // Reset zone filter when switching away from alquileres
  useEffect(() => {
    if (activeTab !== 'alquileres') setActiveZone('all');
  }, [activeTab]);

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Blurred background image */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/16/Unlar.jpg"
          alt=""
          className="w-full h-full object-cover opacity-[0.25]"
        />
        <div className="absolute inset-0 bg-gray-950/60" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Tab Bar */}
        <div className="sticky top-16 z-20 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
          <div
            ref={tabsRef}
            className="relative overflow-x-auto scrollbar-hide"
          >
            <div className="flex items-center gap-1 px-4 md:px-6 py-3 min-w-max md:justify-center">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={isActive ? activeTabRef : null}
                    onClick={() => {
                      if (tab.id === 'ingresantes' || tab.id === 'calendario') {
                        navigate(tab.route);
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 bg-primary-600/20 border border-primary-500/30 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <tab.icon className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Animated underline indicator */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-primary-500 rounded-full"
              animate={indicatorStyle}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <activeTabConfig.icon className="h-6 w-6 text-primary-400" />
              <h2 className="text-xl font-bold text-white">{activeTabConfig.label}</h2>
            </div>
            <div className="flex items-center gap-3">
              {activeTabConfig.createRoute && (
                <button
                  onClick={() => navigate(activeTabConfig.createRoute!)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Publicar</span>
                </button>
              )}
              <button
                onClick={() => navigate(activeTabConfig.route)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
              >
                <span>Ver más</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content with Animation */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
          <div className={`flex gap-6 ${activeTab === 'alquileres' ? 'items-start' : ''}`}>

            {/* ── Zone Sidebar (Alquileres only) ── */}
            <AnimatePresence>
              {activeTab === 'alquileres' && (
                <motion.aside
                  initial={{ opacity: 0, x: -16, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: -16, width: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="hidden md:block shrink-0 w-48"
                >
                  <div className="sticky top-36 rounded-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-md p-4 space-y-1">
                    <div className="flex items-center gap-2 px-1 pb-2 mb-1 border-b border-gray-800">
                      <MapPin className="h-3.5 w-3.5 text-primary-400" />
                      <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                        Zona
                      </span>
                    </div>
                    {ZONE_FILTERS.map((zone) => {
                      const isActive = activeZone === zone.id;
                      return (
                        <button
                          key={zone.id}
                          onClick={() => setActiveZone(zone.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                            isActive
                              ? 'bg-primary-600/20 border border-primary-500/40 text-primary-300'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent'
                          }`}
                        >
                          <span className="text-base leading-none">{zone.icon}</span>
                          <span className="leading-tight">{zone.label}</span>
                          {isActive && (
                            <motion.span
                              layoutId="zoneActiveIndicator"
                              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* ── Main content grid ── */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${activeZone}`}
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : (
                    <TabContent tabId={activeTab} data={displayData} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right Sidebar: Campus Map & Quick References ── */}
            <aside className="hidden lg:block shrink-0 w-80">
              <div className="sticky top-36 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Plano del Campus
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/ingresantes/campus')}
                    className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase transition-colors"
                  >
                    Ver 3D ↗
                  </button>
                </div>

                {/* Interactive 3D Campus Map */}
                <div className="h-60 rounded-xl overflow-hidden border border-gray-800 bg-gray-955 shadow-inner">
                  <CampusMap3D compact={true} />
                </div>

                {/* Quick References Mini-List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Referencias Rápidas
                  </span>
                  <div className="h-48 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-850 scrollbar-track-transparent">
                    {QUICK_CAMPUS_REFS.map((ref) => (
                      <div
                        key={ref.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-950/40 border border-gray-850 text-[10.5px] text-gray-400 hover:text-white transition-colors"
                      >
                        <span className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-bold font-mono shrink-0 ${
                          ref.type === 'numeric' 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                            : ref.type === 'letter'
                            ? 'bg-primary-500/10 border-primary-500/30 text-primary-400'
                            : 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                        }`}>
                          {ref.label}
                        </span>
                        <span className="truncate font-medium">{ref.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

      </div>

      {/* ── Full Resolution Campus Map Modal ── */}
      <Modal
        isOpen={isMapModalOpen}
        onClose={() => {
          setIsMapModalOpen(false);
          setZoomLevel(1);
        }}
        title="Plano de Distribución del Campus UNLaR"
        size="lg"
      >
        <div className="flex flex-col items-center justify-center p-1 relative overflow-hidden">
          {/* Zoom Controls HUD Overlay */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-gray-900/90 backdrop-blur-md border border-gray-800 p-1.5 rounded-xl shadow-lg pointer-events-auto">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
              disabled={zoomLevel <= 1}
              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
              title="Alejar"
            >
              -
            </button>
            <span className="text-[10px] font-mono font-bold text-gray-300 min-w-[36px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 4))}
              disabled={zoomLevel >= 4}
              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
              title="Acercar"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="ml-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-[10px] font-semibold text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Restablecer"
            >
              Reajustar
            </button>
          </div>

          {/* Scrollable Zoom Window */}
          <div className="w-full h-[65vh] rounded-xl border border-gray-800 bg-gray-950 overflow-auto flex items-center justify-center p-4 cursor-zoom-in relative scrollbar-thin scrollbar-thumb-gray-800">
            <img
              src="https://i.ibb.co/HDL95dww/ubi-completa-unlar.png"
              alt="Plano Completo UNLaR"
              style={{
                width: `${100 * zoomLevel}%`,
                height: `${100 * zoomLevel}%`,
                transition: 'width 0.25s ease-out, height 0.25s ease-out',
              }}
              className="max-w-none max-h-none object-contain rounded-lg"
            />
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs text-gray-400 border-t border-gray-800 pt-3">
            <span>Desplazate sobre la imagen para navegar en alto zoom.</span>
            <a
              href="https://i.ibb.co/HDL95dww/ubi-completa-unlar.png"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 font-bold uppercase transition-colors"
            >
              Abrir original ↗
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================
// Tab Content Renderer
// ============================================
function TabContent({ tabId, data }: { tabId: TabId; data: unknown[] }) {
  if (tabId === 'ingresantes' || tabId === 'calendario') {
    return <ComingSoonContent tabId={tabId} />;
  }

  if (data.length === 0) {
    return <EmptyContent />;
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {data.map((item, index) => (
        <motion.div
          key={(item as { id?: string }).id || index}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {renderCard(tabId, item)}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// Card Renderer
// ============================================
function renderCard(tabId: TabId, item: unknown) {
  switch (tabId) {
    case 'alquileres':
      return <RentalPreviewCard rental={item as Partial<import('@/shared/types').Rental>} />;
    case 'marketplace':
      return <MarketplacePreviewCard item={item as Partial<import('@/shared/types').MarketplaceItem>} />;
    case 'foro':
      return <ForumPreviewCard post={item as Partial<import('@/shared/types').ForumPost>} />;
    case 'eventos':
      return <EventPreviewCard event={item as Partial<import('@/shared/types').Event>} />;
    case 'perdidos':
      return <GenericPreviewCard item={item as Partial<import('@/shared/types').LostFoundItem>} type="lost_found" />;
    case 'servicios':
      return <GenericPreviewCard item={item as Partial<import('@/shared/types').Service>} type="service" />;
    case 'clases':
      return <GenericPreviewCard item={item as Partial<import('@/shared/types').TutoringListing>} type="tutoring" />;
    default:
      return null;
  }
}

// ============================================
// Helper: Get display data (real or mock)
// ============================================
function getDisplayData(tabId: TabId, realData: unknown[] | undefined): unknown[] {
  // If we have real data, use it
  if (realData && realData.length > 0) return realData;

  // Otherwise fall back to mock data
  switch (tabId) {
    case 'alquileres':
      return mockRentals;
    case 'marketplace':
      return mockMarketplaceItems;
    case 'foro':
      return mockForumPosts;
    case 'eventos':
      return mockEvents;
    case 'perdidos':
      return mockLostFound;
    case 'servicios':
      return mockServices;
    case 'clases':
      return mockTutoring;
    default:
      return [];
  }
}

// ============================================
// Loading Skeleton
// ============================================
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
          <div className="h-40 bg-gray-800" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-800 rounded w-1/2" />
            <div className="h-3 bg-gray-800 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Coming Soon Content
// ============================================
function ComingSoonContent({ tabId }: { tabId: TabId }) {
  const messages: Record<string, { title: string; desc: string }> = {
    ingresantes: { title: 'Modo Ingresante', desc: 'Guías, tips y todo lo que necesitás saber para arrancar en UNLAR.' },
    calendario: { title: 'Calendario Académico', desc: 'Fechas de parciales, inscripciones y eventos importantes.' },
  };

  const content = messages[tabId] || { title: 'Próximamente', desc: 'Esta sección estará disponible pronto.' };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
        {(() => {
          const tab = tabs.find((t) => t.id === tabId);
          if (tab) {
            const Icon = tab.icon;
            return <Icon className="h-8 w-8 text-gray-500" />;
          }
          return null;
        })()}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
      <p className="text-sm text-gray-400 max-w-sm">{content.desc}</p>
    </div>
  );
}

// ============================================
// Empty Content
// ============================================
function EmptyContent() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
        <Plus className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Sin publicaciones</h3>
      <p className="text-sm text-gray-400 max-w-sm">
        No hay publicaciones en esta sección todavía. ¡Sé el primero en publicar!
      </p>
    </div>
  );
}
