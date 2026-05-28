import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, LayoutGrid, List, Info, Globe, GraduationCap, X, Search } from 'lucide-react';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { Badge } from '@/shared/ui/Badge';
import { CalendarEvent, type CalendarEventData } from '../components/CalendarEvent';

// ============================================
// Official 2026 Academic Calendar Data
// ============================================
const OFFICIAL_EVENTS: CalendarEventData[] = [
  // Cursos de Ingreso
  {
    id: 'off-ingreso-gen',
    title: 'Cursos de Ingreso (General - Excepto Med/Bioimágenes)',
    description: 'Curso de nivelación obligatorio para ingresantes de todas las carreras (excepto Medicina y Bioimágenes).',
    event_date: '2026-02-02',
    end_date: '2026-02-28',
    event_type: 'enrollment',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-ingreso-med',
    title: 'Curso de Ingreso - Medicina',
    description: 'Curso de ingreso obligatorio para los aspirantes a la carrera de Medicina.',
    event_date: '2026-02-02',
    end_date: '2026-03-28',
    event_type: 'enrollment',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-ingreso-bio',
    title: 'Curso de Ingreso - Lic. en Producción de Bioimágenes',
    description: 'Curso de ingreso obligatorio para los aspirantes a la carrera de Lic. en Producción de Bioimágenes.',
    event_date: '2026-03-09',
    end_date: '2026-06-20',
    event_type: 'enrollment',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Inscripciones
  {
    id: 'off-insc-1c',
    title: 'Inscripción Online - Materias Anuales y 1º Cuatrimestre',
    description: 'Inscripción online para cursar materias anuales y del primer cuatrimestre a través del sistema SIU Guaraní.',
    event_date: '2026-03-09',
    end_date: '2026-03-21',
    event_type: 'enrollment',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-insc-2c',
    title: 'Inscripción Online - Materias del 2º Cuatrimestre',
    description: 'Inscripción online para cursar materias del segundo cuatrimestre a través del sistema SIU Guaraní.',
    event_date: '2026-08-10',
    end_date: '2026-08-22',
    event_type: 'enrollment',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Clases / Cuatrimestres
  {
    id: 'off-clases-1c',
    title: 'Clases del 1º Cuatrimestre',
    description: 'Período lectivo correspondiente al primer cuatrimestre de cursado.',
    event_date: '2026-03-09',
    end_date: '2026-06-20',
    event_type: 'other',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-clases-2c',
    title: 'Clases del 2º Cuatrimestre',
    description: 'Período lectivo correspondiente al segundo cuatrimestre de cursado.',
    event_date: '2026-08-10',
    end_date: '2026-11-21',
    event_type: 'other',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // PFO Medicina
  {
    id: 'off-pfo-1',
    title: 'PFO Medicina - Clases (Práctica Final Obligatoria)',
    description: 'Clases especiales de la Práctica Final Obligatoria de la carrera de Medicina.',
    event_date: '2026-03-28',
    end_date: '2026-03-30',
    event_type: 'other',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-pfo-2',
    title: 'PFO Medicina - Clases (Práctica Final Obligatoria)',
    description: 'Clases especiales de la Práctica Final Obligatoria de la carrera de Medicina.',
    event_date: '2026-05-23',
    end_date: '2026-05-26',
    event_type: 'other',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-pfo-3',
    title: 'PFO Medicina - Clases (Práctica Final Obligatoria)',
    description: 'Clases especiales de la Práctica Final Obligatoria de la carrera de Medicina.',
    event_date: '2026-08-01',
    end_date: '2026-08-03',
    event_type: 'other',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-pfo-4',
    title: 'PFO Medicina - Clases (Práctica Final Obligatoria)',
    description: 'Clases especiales de la Práctica Final Obligatoria de la carrera de Medicina.',
    event_date: '2026-09-26',
    end_date: '2026-09-28',
    event_type: 'other',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-pfo-5',
    title: 'PFO Medicina - Clases (Práctica Final Obligatoria)',
    description: 'Clases de cierre de la Práctica Final Obligatoria de la carrera de Medicina.',
    event_date: '2026-11-21',
    end_date: null,
    event_type: 'other',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Materia Cero
  {
    id: 'off-mat-cero',
    title: 'Examen Materia Cero - Medicina',
    description: 'Instancia de examen presencial obligatorio (Materia 0) para estudiantes de Medicina.',
    event_date: '2026-04-06',
    end_date: '2026-04-07',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Mesas de Exámenes - Feb/Mar
  {
    id: 'off-exam-febmar-1',
    title: 'Exámenes Finales - 1º Llamado Febrero/Marzo',
    description: 'Primer llamado del turno ordinario de exámenes finales de Febrero/Marzo.',
    event_date: '2026-02-02',
    end_date: '2026-02-07',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-exam-febmar-2',
    title: 'Exámenes Finales - 2º Llamado Febrero/Marzo',
    description: 'Segundo llamado del turno ordinario de exámenes finales de Febrero/Marzo.',
    event_date: '2026-02-18',
    end_date: '2026-02-24',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-exam-febmar-3',
    title: 'Exámenes Finales - 3º Llamado Febrero/Marzo',
    description: 'Tercer llamado del turno ordinario de exámenes finales de Febrero/Marzo.',
    event_date: '2026-03-02',
    end_date: '2026-03-07',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Mesas Mayo
  {
    id: 'off-exam-mayo',
    title: 'Exámenes Finales - Turno Especial Mayo',
    description: 'Llamado único de exámenes finales correspondientes al turno especial de Mayo.',
    event_date: '2026-05-11',
    end_date: '2026-05-16',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Mesas Julio/Agosto
  {
    id: 'off-exam-julago-1',
    title: 'Exámenes Finales - 1º Llamado Julio/Agosto',
    description: 'Primer llamado del turno ordinario de exámenes finales de Julio/Agosto.',
    event_date: '2026-06-29',
    end_date: '2026-07-04',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-exam-julago-2',
    title: 'Exámenes Finales - 2º Llamado Julio/Agosto',
    description: 'Segundo llamado del turno ordinario de exámenes finales de Julio/Agosto.',
    event_date: '2026-08-03',
    end_date: '2026-08-08',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Mesas Septiembre
  {
    id: 'off-exam-sept',
    title: 'Exámenes Finales - Turno Especial Septiembre',
    description: 'Llamado único de exámenes finales correspondientes al turno especial de Septiembre.',
    event_date: '2026-09-07',
    end_date: '2026-09-12',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Mesas Nov/Dic
  {
    id: 'off-exam-novdic-1',
    title: 'Exámenes Finales - 1º Llamado Noviembre/Diciembre',
    description: 'Primer llamado del turno ordinario de exámenes finales de Noviembre/Diciembre.',
    event_date: '2026-11-23',
    end_date: '2026-11-28',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-exam-novdic-2',
    title: 'Exámenes Finales - 2º Llamado Noviembre/Diciembre',
    description: 'Segundo llamado del turno ordinario de exámenes finales de Noviembre/Diciembre.',
    event_date: '2026-12-07',
    end_date: '2026-12-12',
    event_type: 'exam',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  // Colaciones
  {
    id: 'off-col-1',
    title: 'Acto Académico de Colación',
    description: 'Ceremonia oficial y pública de entrega de títulos universitarios aprobada por resolución rectoral.',
    event_date: '2026-03-27',
    end_date: null,
    event_type: 'deadline',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-col-2',
    title: 'Acto Académico de Colación',
    description: 'Ceremonia oficial y pública de entrega de títulos universitarios aprobada por resolución rectoral.',
    event_date: '2026-04-10',
    end_date: null,
    event_type: 'deadline',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-col-3',
    title: 'Acto Académico de Colación',
    description: 'Ceremonia oficial y pública de entrega de títulos universitarios aprobada por resolución rectoral.',
    event_date: '2026-05-29',
    end_date: null,
    event_type: 'deadline',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-col-4',
    title: 'Acto Académico de Colación',
    description: 'Ceremonia oficial y pública de entrega de títulos universitarios aprobada por resolución rectoral.',
    event_date: '2026-07-03',
    end_date: null,
    event_type: 'deadline',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-col-5',
    title: 'Acto Académico de Colación',
    description: 'Ceremonia oficial y pública de entrega de títulos universitarios aprobada por resolución rectoral.',
    event_date: '2026-09-18',
    end_date: null,
    event_type: 'deadline',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
  {
    id: 'off-col-6',
    title: 'Acto Académico de Colación',
    description: 'Ceremonia oficial y pública de entrega de títulos universitarios aprobada por resolución rectoral.',
    event_date: '2026-12-11',
    end_date: null,
    event_type: 'deadline',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },

  // ─── Receso Estival ───
  {
    id: 'hol-rec-enero',
    title: 'Receso Estival',
    description: 'Receso estival de la UNLaR. Sin actividad académica ni administrativa (1 al 31 de enero).',
    event_date: '2026-01-01',
    end_date: '2026-01-31',
    event_type: 'holiday',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },

  // ─── Feriados Nacionales 2026 ───
  { id: 'hol-01-01', title: 'Año Nuevo', description: 'Feriado Nacional.', event_date: '2026-01-01', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-02-16-17', title: 'Carnaval', description: 'Feriado Nacional — Carnaval (16 y 17 de febrero).', event_date: '2026-02-16', end_date: '2026-02-17', event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-03-24', title: 'Día Nacional de la Memoria', description: 'Día Nacional de la Memoria por la Verdad y la Justicia. Feriado Nacional.', event_date: '2026-03-24', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-04-02', title: 'Día del Veterano / Jueves Santo', description: 'Día del Veterano y de los Caídos en la Guerra de Malvinas, y Jueves Santo. Feriado Nacional.', event_date: '2026-04-02', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-04-03', title: 'Viernes Santo', description: 'Feriado Nacional.', event_date: '2026-04-03', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-05-01', title: 'Día del Trabajador', description: 'Feriado Nacional.', event_date: '2026-05-01', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-05-25', title: 'Día de la Revolución de Mayo', description: 'Feriado Nacional.', event_date: '2026-05-25', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-06-17', title: 'Paso a la Inmortalidad del Gral. Güemes', description: 'Feriado Nacional.', event_date: '2026-06-17', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-06-20', title: 'Paso a la Inmortalidad del Gral. Belgrano', description: 'Feriado Nacional. Coincide con el fin del 1.º Cuatrimestre.', event_date: '2026-06-20', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-07-09', title: 'Día de la Independencia', description: 'Feriado Nacional.', event_date: '2026-07-09', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-08-17', title: 'Paso a la Inmortalidad del Gral. San Martín', description: 'Feriado Nacional.', event_date: '2026-08-17', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-10-12', title: 'Día del Respeto a la Diversidad Cultural', description: 'Feriado Nacional.', event_date: '2026-10-12', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-11-20', title: 'Día de la Soberanía Nacional', description: 'Feriado Nacional.', event_date: '2026-11-20', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-12-08', title: 'Inmaculada Concepción de María', description: 'Feriado Nacional.', event_date: '2026-12-08', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-12-25', title: 'Navidad', description: 'Feriado Nacional.', event_date: '2026-12-25', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },

  // ─── Feriados Provinciales — La Rioja ───
  { id: 'hol-prov-02-16', title: 'Gral. Juan Facundo Quiroga', description: 'Feriado Provincial — "El Tigre de los Llanos". Coincide con el inicio del Carnaval.', event_date: '2026-02-16', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-prov-05-20', title: 'Fundación de La Rioja', description: 'Feriado Provincial — Día de la Fundación de La Rioja.', event_date: '2026-05-20', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-prov-08-04', title: 'Monseñor Enrique Angelelli', description: 'Feriado Provincial — Aniversario del fallecimiento del Monseñor Enrique Angelelli.', event_date: '2026-08-04', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-prov-11-12', title: 'Ángel Vicente Peñaloza', description: 'Feriado Provincial — Aniversario del fallecimiento de Ángel Vicente Peñaloza.', event_date: '2026-11-12', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-prov-12-31', title: 'Tinkunaco Riojano', description: 'Feriado Provincial — Día del Tinkunaco Riojano.', event_date: '2026-12-31', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },

  // ─── Fechas Institucionales UNLaR ───
  { id: 'hol-inst-09-17', title: 'Día de la UNLaR — Día del Docente Universitario', description: 'Fecha institucional de la UNLaR. Sin actividad académica.', event_date: '2026-09-17', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-inst-09-21', title: 'Día del Estudiante / Día de la Sanidad', description: 'Sin actividad académica. Con actividad administrativa.', event_date: '2026-09-21', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },
  { id: 'hol-inst-11-26', title: 'Día del Nodocente UNLaR', description: 'Fecha institucional de la UNLaR.', event_date: '2026-11-26', end_date: null, event_type: 'holiday', career_ids: [], is_global: true, created_at: '2026-01-01' },

  // ─── Receso Invernal ───
  {
    id: 'hol-rec-invierno',
    title: 'Receso Invernal',
    description: 'Receso invernal de la UNLaR (13 al 24 de julio).',
    event_date: '2026-07-13',
    end_date: '2026-07-24',
    event_type: 'holiday',
    career_ids: [],
    is_global: true,
    created_at: '2026-01-01',
  },
];

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

interface Career {
  id: string;
  name: string;
  code: string;
}

export function CalendarPage() {
  const { profile } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEventData[]>([]);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null);
  const [currentSemester, setCurrentSemester] = useState<'first' | 'second' | 'all'>('first');
  const [selectedCareerId, setSelectedCareerId] = useState<string>('');
  // Career searchable combobox state
  const [careerSearch, setCareerSearch] = useState<string>('');

  // Fetch careers to populate filter list
  const { data: careers = [] } = useQuery({
    queryKey: ['careers-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('careers')
        .select('id, name, code')
        .order('name', { ascending: true });

      if (error) throw new Error(error.message);
      return (data as Career[]) ?? [];
    },
  });

  // Fetch custom calendar events from Supabase
  const { data: dbEvents = [] } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('calendar_events') as any)
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw new Error(error.message);
      return (data as CalendarEventData[]) ?? [];
    },
  });

  // Pre-select user's own career from profile if available (without filling the search box)
  useEffect(() => {
    if (profile?.career_id) {
      setSelectedCareerId(profile.career_id);
      // Do NOT set careerSearch — keep it empty so all chips remain visible
    }
  }, [profile?.career_id]);

  // Filtered career list: matches search query, selected career always first
  const filteredCareers = useMemo(() => {
    if (!careerSearch.trim()) {
      if (selectedCareerId) {
        const selected = careers.find((c) => c.id === selectedCareerId);
        return selected ? [selected] : [];
      }
      return [];
    }

    const base = careers.filter(
      (c) =>
        c.name.toLowerCase().includes(careerSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(careerSearch.toLowerCase())
    );

    // Always sort so the selected career appears first
    if (selectedCareerId) {
      base.sort((a, b) => {
        if (a.id === selectedCareerId) return -1;
        if (b.id === selectedCareerId) return 1;
        return 0;
      });
    }

    return base;
  }, [careers, careerSearch, selectedCareerId]);

  const handleCareerSelect = (career: Career | null) => {
    if (career === null) {
      setSelectedCareerId('');
    } else {
      setSelectedCareerId(career.id);
    }
    // Always clear search so all chips remain visible after selection
    setCareerSearch('');
  };

  // Combine database events with official pre-populated events
  const allEvents = useMemo(() => {
    const combined = [...OFFICIAL_EVENTS, ...dbEvents];
    const seen = new Set<string>();
    return combined.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
  }, [dbEvents]);

  // Find currently selected career object
  const selectedCareer = useMemo(() => {
    return careers.find((c) => c.id === selectedCareerId);
  }, [careers, selectedCareerId]);

  // Filter events based on career and types
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // 1. Type Filter (if explicitly clicked on activeTypeFilter)
      if (activeTypeFilter && event.event_type !== activeTypeFilter) {
        return false;
      }

      const careerName = selectedCareer?.name.toLowerCase() || '';

      // Medicine specific flags
      const isMedicineEvent =
        event.id.includes('med') ||
        event.id.includes('pfo') ||
        event.id.includes('cero');

      // Bioimages specific flags
      const isBioimagesEvent = event.id.includes('bio');

      // General ingresante / class flags
      const isGeneralIngresoEvent = event.id === 'off-ingreso-gen' || event.id === 'off-insc-1c';

      if (selectedCareerId) {
        // If a career is selected:
        if (careerName.includes('medicina')) {
          // If career is Medicina: show medicine specific, hide general ingresantes or bioimages.
          if (isBioimagesEvent || isGeneralIngresoEvent) return false;
        } else if (careerName.includes('bioimágenes') || careerName.includes('imagenes') || careerName.includes('imágenes')) {
          // If career is Bioimages: show bioimages specific, hide medicine or general ingresantes.
          if (isMedicineEvent || isGeneralIngresoEvent) return false;
        } else {
          // For any other career: show general ingresantes, hide specific ones.
          if (isMedicineEvent || isBioimagesEvent) return false;
        }
      } else {
        // IMPORTANT: If NO career is selected: ONLY show "Mesas de Examen" and "Feriados"
        // to prevent crowding/clutter!
        const isExamOrHoliday = event.event_type === 'exam' || event.event_type === 'holiday';
        if (!isExamOrHoliday) {
          return false;
        }
      }

      // 3. User logged career visibility (for custom DB events)
      if (!event.is_global && event.career_ids && event.career_ids.length > 0) {
        if (selectedCareerId) {
          return event.career_ids.includes(selectedCareerId);
        }
        return false;
      }

      return true;
    });
  }, [allEvents, activeTypeFilter, selectedCareerId, selectedCareer]);

  // Priority order: exam > enrollment > deadline > holiday > other (class periods lowest)
  const EVENT_PRIORITY: Record<string, number> = {
    exam: 5,
    enrollment: 4,
    deadline: 3,
    holiday: 2,
    other: 1,
  };

  // Check if a day has events and return them sorted by priority
  const getEventsForDate = (dateStr: string) => {
    const targetTime = new Date(dateStr + 'T00:00:00').getTime();
    const events = filteredEvents.filter((event) => {
      const startTime = new Date(event.event_date + 'T00:00:00').getTime();
      const endTime = event.end_date 
        ? new Date(event.end_date + 'T00:00:00').getTime() 
        : startTime;
      return targetTime >= startTime && targetTime <= endTime;
    });
    // Sort so highest-priority events come first (exam always wins)
    return events.sort((a, b) => (EVENT_PRIORITY[b.event_type] ?? 0) - (EVENT_PRIORITY[a.event_type] ?? 0));
  };

  const handleDayClick = (dateStr: string, dayEvents: CalendarEventData[]) => {
    setSelectedDate(dateStr);
    setSelectedEvents(dayEvents);
  };

  // Group events by month for the List View (exclude class periods unless active type filter = other)
  const groupedEvents = useMemo(() => {
    const groups: Record<string, CalendarEventData[]> = {};
    // In list view, don't show class period events unless explicitly filtered for them
    const listEvents = filteredEvents.filter(
      (e) => e.event_type !== 'other' || activeTypeFilter === 'other'
    );
    listEvents.forEach((event) => {
      const date = new Date(event.event_date + 'T00:00:00');
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(event);
    });
    return groups;
  }, [filteredEvents, activeTypeFilter]);

  const monthLabels = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  };

  // Helper to render a specific month card
  const renderMonthCard = (monthIndex: number) => {
    const year = 2026;
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }

    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/90 p-4 shadow-lg backdrop-blur-md transition-all hover:border-gray-700">
        <h3 className="mb-3 text-center text-sm font-bold text-white uppercase tracking-wider text-primary-400">
          {MONTH_NAMES[monthIndex]}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium mb-1">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="text-gray-500">
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${monthIndex}-${idx}`} className="py-1" />;
            }

            const dateStr = `2026-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = getEventsForDate(dateStr);
            const hasEvents = dayEvents.length > 0;

            // Dominant type is now always the highest priority (exam wins over classes)
            const dominantType = hasEvents ? dayEvents[0].event_type : null;
            // Check if there are also class-period events behind a higher-priority event
            const hasClassPeriod = dayEvents.some((e) => e.event_type === 'other');
            const hasHigherPriorityThanClass = dominantType && dominantType !== 'other';

            // Cell styling — always use white text on hover for readability
            let cellStyle = 'text-gray-400 hover:bg-gray-800 hover:text-white';
            let borderStyle = 'border-transparent';

            if (hasEvents) {
              if (dominantType === 'exam') {
                cellStyle = 'bg-rose-600/25 text-rose-200 hover:bg-rose-600 hover:text-white font-bold';
                borderStyle = 'border-rose-500/50';
              } else if (dominantType === 'enrollment') {
                cellStyle = 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold';
                borderStyle = 'border-emerald-500/40';
              } else if (dominantType === 'deadline') {
                cellStyle = 'bg-violet-500/20 text-violet-300 hover:bg-violet-600 hover:text-white font-bold';
                borderStyle = 'border-violet-500/40';
              } else if (dominantType === 'holiday') {
                cellStyle = 'bg-gray-700/50 text-gray-300 hover:bg-gray-600 hover:text-white font-bold';
                borderStyle = 'border-gray-600';
              } else {
                // Class period only: very subtle, unobtrusive styling
                cellStyle = 'bg-amber-500/8 text-gray-400 hover:bg-gray-800 hover:text-white';
                borderStyle = 'border-amber-500/15';
              }
            }

            const isSelected = selectedDate === dateStr;
            if (isSelected) {
              borderStyle = 'border-primary-500 ring-2 ring-primary-500/50';
            }

            return (
              <button
                key={`day-${monthIndex}-${day}`}
                onClick={() => handleDayClick(dateStr, dayEvents)}
                className={`py-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center min-h-[28px] ${cellStyle} ${borderStyle}`}
              >
                <span>{day}</span>
                {hasEvents && dominantType !== 'other' && (
                  // Colored indicator dot for non-class events
                  <span className="h-1 w-1 rounded-full bg-current mt-0.5" />
                )}
                {hasClassPeriod && hasHigherPriorityThanClass && (
                  // Extra tiny amber dot to show class period is also active
                  <span className="h-0.5 w-0.5 rounded-full bg-amber-400/50 mt-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const filterButtons = [
    { key: 'enrollment', label: 'Inscripciones / Ingreso', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' },
    { key: 'exam', label: 'Mesas de Examen', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' },
    { key: 'deadline', label: 'Colaciones de Grado', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40 hover:bg-violet-500/30' },
    { key: 'other', label: 'Cursada / Cuatrimestre', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Blurred background image */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <img
          src="https://mediosrioja.com.ar/wp-content/uploads/2024/07/unlar-1.jpg"
          alt=""
          className="w-full h-full object-cover opacity-[0.25]"
        />
        <div className="absolute inset-0 bg-gray-950/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary-400" />
              Calendario Académico 2026
            </h1>
            <p className="mt-1.5 text-sm text-gray-400 max-w-2xl leading-relaxed">
              Resolución Rectoral N.º 1088. **Por defecto, solo se muestran mesas de exámenes y feriados.** 
              Selecciona tu carrera para activar de inmediato tus cursillos de ingreso, clases y eventos específicos de cursada.
            </p>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                viewMode === 'grid'
                  ? 'bg-primary-600 border-primary-500 text-white shadow-lg'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Vista Mensual
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                viewMode === 'list'
                  ? 'bg-primary-600 border-primary-500 text-white shadow-lg'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
              Vista Cronológica
            </button>
          </div>
        </div>

        {/* Career Search + Inline Chips */}
        <div className="space-y-3 py-5 border-y border-gray-800/50">
          <div>
            <label className="block text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">
              Buscar Carrera
            </label>
            <div className="relative max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                id="career-search-input"
                type="text"
                placeholder="Ej: Ingeniería, Medicina, Abogacía…"
                value={careerSearch}
                onChange={(e) => setCareerSearch(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-gray-700 bg-gray-900/90 pl-10 pr-10 py-2 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                autoComplete="off"
              />
              {careerSearch && (
                <button
                  onClick={() => setCareerSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  title="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Inline chip results */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              layout
              onClick={() => handleCareerSelect(null)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                !selectedCareerId
                  ? 'bg-primary-600 border-primary-500 text-white shadow-md shadow-primary-900/40'
                  : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              <Globe className="h-3 w-3 shrink-0" />
              Sin carrera
            </motion.button>

            <AnimatePresence mode="popLayout">
              {filteredCareers.map((career) => (
                <motion.button
                  key={career.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleCareerSelect(career)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedCareerId === career.id
                      ? 'bg-primary-600 border-primary-500 text-white shadow-md shadow-primary-900/40'
                      : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  <GraduationCap className="h-3 w-3 shrink-0" />
                  <span className="max-w-[180px] truncate">{career.name}</span>
                  <span className="text-[10px] opacity-50 font-mono">{career.code}</span>
                </motion.button>
              ))}
            </AnimatePresence>

            {careerSearch.trim() !== '' && filteredCareers.length === 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500 self-center italic"
              >
                Sin resultados para &ldquo;{careerSearch}&rdquo;
              </motion.span>
            )}
          </div>

          {/* Category filter chips */}
          <div className="pt-2 border-t border-gray-800/40">
            <span className="block text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">
              Filtrar por Categoría
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTypeFilter(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeTypeFilter === null
                    ? 'bg-white border-white text-gray-950'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              {filterButtons.map((btn) => {
                const isActive = activeTypeFilter === btn.key;
                return (
                  <button
                    key={btn.key}
                    onClick={() => setActiveTypeFilter(btn.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      isActive
                        ? `${btn.color} shadow-md`
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected career feedback banner */}
        <AnimatePresence>
          {selectedCareerId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 rounded-xl bg-primary-950/30 border border-primary-900/50 p-4 text-sm text-primary-300"
            >
              <Info className="h-5 w-5 text-primary-400 shrink-0" />
              <span>
                Mostrando el calendario personalizado para{' '}
                <strong className="text-white">{selectedCareer?.name}</strong>. Cursillos de ingreso y actividades específicas de tu carrera ya están integrados en las grillas.
              </span>
              <button
                onClick={() => handleCareerSelect(null)}
                className="ml-auto text-gray-500 hover:text-white transition-colors shrink-0"
                title="Quitar filtro"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Layouts */}
        {viewMode === 'grid' ? (
          <div className="space-y-6">
            {/* Semester Filter Tabs */}
            <div className="flex justify-center bg-gray-900/60 p-1 border border-gray-800 rounded-xl max-w-sm mx-auto">
              <button
                onClick={() => setCurrentSemester('first')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  currentSemester === 'first' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                1º Semestre
              </button>
              <button
                onClick={() => setCurrentSemester('second')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  currentSemester === 'second' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                2º Semestre
              </button>
              <button
                onClick={() => setCurrentSemester('all')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  currentSemester === 'all' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Todo el Año
              </button>
            </div>

            {/* Grid of Months */}
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {MONTH_NAMES.map((_, idx) => {
                const isFirstSem = idx < 6;
                if (currentSemester === 'first' && !isFirstSem) return null;
                if (currentSemester === 'second' && isFirstSem) return null;
                return (
                  <motion.div
                    key={`month-card-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderMonthCard(idx)}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ) : (
          /* List chronological view */
          <div className="space-y-8 max-w-4xl mx-auto">
            {Object.entries(groupedEvents).map(([monthKey, monthEvents]) => (
              <div key={monthKey} className="space-y-3">
                <h2 className="text-md font-bold uppercase tracking-wider text-primary-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary-500 rounded-full" />
                  {monthLabels(monthKey)}
                </h2>
                <div className="grid gap-3">
                  {monthEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <CalendarEvent event={event} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Date detail drawer/panel */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-800 p-6 shadow-2xl backdrop-blur-lg"
            >
              <div className="mx-auto max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase text-primary-400 font-bold tracking-widest">
                      Actividades del Día
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 scrollbar-thin">
                  {selectedEvents.length === 0 ? (
                    <div className="flex items-center gap-2 text-gray-500 py-4">
                      <Info className="h-5 w-5" />
                      <p className="text-sm">No hay eventos oficiales ni particulares agendados para esta fecha con los filtros actuales.</p>
                    </div>
                  ) : (
                    selectedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 transition-colors hover:border-gray-700"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge
                            variant={
                              event.event_type === 'exam'
                                ? 'danger'
                                : event.event_type === 'enrollment'
                                ? 'info'
                                : event.event_type === 'deadline'
                                ? 'warning'
                                : 'default'
                            }
                            size="sm"
                          >
                            {event.event_type === 'exam'
                              ? 'Examen'
                              : event.event_type === 'enrollment'
                              ? 'Inscripción'
                              : event.event_type === 'deadline'
                              ? 'Colación'
                              : 'Cursada'}
                          </Badge>
                          {event.is_global ? (
                            <span className="text-[10px] bg-primary-950 text-primary-400 px-2 py-0.5 rounded flex items-center gap-1">
                              <Globe className="h-3 w-3" /> Global
                            </span>
                          ) : (
                            <span className="text-[10px] bg-purple-950 text-purple-400 px-2 py-0.5 rounded flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" /> Carrera
                            </span>
                          )}
                        </div>
                        <h5 className="font-semibold text-white text-sm">{event.title}</h5>
                        {event.description && (
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                        {event.end_date && (
                          <p className="text-[10px] text-gray-500 mt-2 font-medium">
                            Rango: {new Date(event.event_date + 'T00:00:00').toLocaleDateString('es-AR')} al {new Date(event.end_date + 'T00:00:00').toLocaleDateString('es-AR')}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
