-- ============================================
-- SEED COMPLETO - Migración de todos los datos mock del frontend
-- ============================================
-- Este script migra TODOS los datos hardcodeados del frontend a Supabase
-- Ejecutar en: Supabase SQL Editor
-- Autor: Ecosistema UNLAR
-- Fecha: 2026-05-30
-- ============================================

-- Usuario de prueba (ya existe en auth.users)
-- ID: 44c2f936-b605-488e-a537-e146ad0d40dc
-- Email: cassieluc@gmail.com

-- ============================================
-- 1. RENTALS (Alquileres)
-- ============================================
INSERT INTO rentals (
  id, author_id, title, description, type, price, currency, 
  location, neighborhood, amenities, image_urls, available_from, 
  allows_pets, gender_preference, status, view_count, favorite_count, created_at
) VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Depto 2 ambientes a 3 cuadras de UNLAR',
    'Departamento luminoso con balcón, ideal para estudiantes. Incluye expensas. Zona tranquila cerca de Av. Ortiz de Ocampo.',
    'apartment',
    180000,
    'ARS',
    'Av. Ortiz de Ocampo 1450',
    'Centro',
    ARRAY['WiFi', 'Cocina', 'Lavarropas', 'Balcón'],
    ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    '2025-03-01',
    false,
    'any',
    'active',
    45,
    12,
    '2025-01-15T10:00:00Z'
  ),
  (
    'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Habitación en depto compartido - Solo chicas',
    'Habitación privada en departamento compartido con otra estudiante. Gastos incluidos. A 5 min caminando de la facu.',
    'room',
    95000,
    'ARS',
    'Calle Pelagio B. Luna 320',
    'Barrio Residencial',
    ARRAY['WiFi', 'Cocina compartida', 'Patio'],
    ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'],
    '2025-02-15',
    false,
    'female',
    'active',
    32,
    8,
    '2025-01-18T14:30:00Z'
  ),
  (
    'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Monoambiente amoblado frente a Ciudad Universitaria',
    'Monoambiente completamente amoblado, con aire acondicionado y heladera. Ideal para ingresantes. Contrato flexible.',
    'apartment',
    150000,
    'ARS',
    'Av. Dr. René Favaloro 800',
    'Ciudad Universitaria',
    ARRAY['Amoblado', 'Aire acondicionado', 'Heladera', 'WiFi'],
    ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    NULL,
    true,
    'any',
    'active',
    67,
    23,
    '2025-01-20T09:15:00Z'
  ),
  (
    'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Depto compartido - Busco compañero/a',
    'Somos 2 estudiantes de Ingeniería buscando un/a tercero/a. Depto grande, 3 habitaciones, living amplio. Dividimos gastos.',
    'shared',
    75000,
    'ARS',
    'Calle San Nicolás de Bari 550',
    'Barrio Norte',
    ARRAY['WiFi', 'Cocina', 'Living', 'Garage'],
    ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    '2025-03-10',
    true,
    'any',
    'active',
    28,
    5,
    '2025-01-22T16:45:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. MARKETPLACE ITEMS (Compra/Venta)
-- ============================================
INSERT INTO marketplace_items (
  id, author_id, title, description, category, price, condition, 
  is_free, image_urls, status, view_count, favorite_count, created_at
) VALUES
  (
    'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Calculadora Científica Casio fx-991ES',
    'Calculadora en excelente estado, la usé solo 1 cuatrimestre para Análisis Matemático. Viene con funda.',
    'electronics',
    25000,
    'like_new',
    false,
    ARRAY['https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400'],
    'active',
    18,
    4,
    '2025-01-19T11:00:00Z'
  ),
  (
    'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Apuntes completos de Derecho Civil I',
    'Apuntes impresos y anillados del Prof. García, incluye resúmenes y casos prácticos. Todo el programa 2024.',
    'notes',
    5000,
    'good',
    false,
    ARRAY['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400'],
    'active',
    34,
    11,
    '2025-01-20T08:30:00Z'
  ),
  (
    'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Notebook Lenovo IdeaPad 3 - Impecable',
    'Lenovo IdeaPad 3, i5 11va gen, 8GB RAM, 256GB SSD. Batería dura 5hs. Ideal para programar o estudiar.',
    'electronics',
    450000,
    'good',
    false,
    ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
    'active',
    56,
    19,
    '2025-01-21T15:20:00Z'
  ),
  (
    'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Libros de Anatomía - REGALO',
    'Ya me recibí y regalo mis libros de Anatomía de Rouvière (3 tomos). Retiro por Ciudad Universitaria.',
    'books',
    NULL,
    'fair',
    true,
    ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    'active',
    89,
    31,
    '2025-01-22T10:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. FORUM POSTS (Foro)
-- ============================================
INSERT INTO forum_posts (
  id, author_id, title, description, category, tags, upvotes, 
  downvotes, comment_count, is_answered, status, view_count, created_at
) VALUES
  (
    'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    '¿Alguien cursó Álgebra con el Prof. Martínez?',
    'Estoy por anotarme en la comisión de la mañana. ¿Cómo es el parcial? ¿Toma mucha teoría o es más práctico?',
    'question',
    ARRAY['álgebra', 'ingeniería', 'parciales'],
    15,
    1,
    8,
    true,
    'active',
    120,
    '2025-01-18T20:00:00Z'
  ),
  (
    'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Review: Cursada de Programación I (2024)',
    'Les cuento mi experiencia cursando Programación I este año. Tips para aprobar, qué estudiar y cómo organizarse.',
    'review',
    ARRAY['programación', 'sistemas', 'review'],
    42,
    3,
    23,
    false,
    'active',
    340,
    '2025-01-16T14:00:00Z'
  ),
  (
    'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    '¿Dónde sacar la libreta universitaria?',
    'Soy ingresante 2025 y no encuentro info sobre dónde tramitar la libreta. ¿Es en Alumnado o en la sede de mi carrera?',
    'question',
    ARRAY['ingresantes', 'trámites', 'libreta'],
    8,
    0,
    5,
    true,
    'active',
    67,
    '2025-01-21T09:30:00Z'
  ),
  (
    'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Recomendación: Mejor bar para estudiar cerca de la facu',
    'Busco un lugar tranquilo con WiFi bueno para estudiar entre clases. ¿Alguna recomendación por la zona de UNLAR?',
    'recommendation',
    ARRAY['recomendación', 'estudio', 'bares'],
    25,
    2,
    14,
    false,
    'active',
    198,
    '2025-01-19T17:45:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. EVENTS (Eventos)
-- ============================================
INSERT INTO events (
  id, author_id, title, description, event_type, start_date, end_date,
  location, is_virtual, virtual_link, max_attendees, current_attendees,
  registration_required, organizer, image_urls, status, view_count, created_at
) VALUES
  (
    'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Hackathon UNLAR 2025',
    '48 horas de programación, innovación y premios. Equipos de hasta 4 personas. Inscripción gratuita para estudiantes UNLAR.',
    'hackathon',
    '2025-03-15T09:00:00Z',
    '2025-03-17T18:00:00Z',
    'Aula Magna - Ciudad Universitaria',
    false,
    NULL,
    100,
    67,
    true,
    'Departamento de Sistemas',
    ARRAY['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400'],
    'active',
    234,
    '2025-01-10T12:00:00Z'
  ),
  (
    'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Charla: Inteligencia Artificial en la Educación',
    'El Dr. López presenta las últimas tendencias en IA aplicada a la educación universitaria. Entrada libre.',
    'talk',
    '2025-02-20T18:00:00Z',
    '2025-02-20T20:00:00Z',
    'Salón de Actos - Sede Centro',
    true,
    'https://meet.google.com/abc-defg-hij',
    NULL,
    45,
    false,
    'Centro de Estudiantes',
    ARRAY['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'],
    'active',
    156,
    '2025-01-12T10:00:00Z'
  ),
  (
    'c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Torneo Interfacultades de Fútbol 5',
    'Torneo relámpago de fútbol 5. Inscribí a tu equipo representando tu carrera. Premios para los 3 primeros.',
    'tournament',
    '2025-02-28T15:00:00Z',
    '2025-02-28T21:00:00Z',
    'Cancha sintética - Polideportivo UNLAR',
    false,
    NULL,
    80,
    52,
    true,
    'Secretaría de Bienestar Estudiantil',
    ARRAY['https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400'],
    'active',
    189,
    '2025-01-14T08:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. LOST & FOUND (Perdidos y Encontrados)
-- ============================================
INSERT INTO lost_found_items (
  id, author_id, title, description, item_type, location_found, 
  date_found, category, is_resolved, image_urls, status, view_count, created_at
) VALUES
  (
    'd6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Encontré llaves con llavero de River',
    'Encontré un juego de llaves (3 llaves + control de portón) con un llavero de River Plate en el pasillo del 2do piso.',
    'found',
    'Facultad de Cs. Exactas - 2do piso',
    '2025-01-20',
    'keys',
    false,
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],
    'active',
    45,
    '2025-01-20T14:00:00Z'
  ),
  (
    'e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Perdí mi pendrive Kingston 64GB',
    'Se me cayó un pendrive negro Kingston de 64GB en algún lugar entre el buffet y la biblioteca. Tiene archivos importantes de mi tesis.',
    'lost',
    'Biblioteca Central / Buffet',
    '2025-01-19',
    'electronics',
    false,
    ARRAY[]::text[],
    'active',
    32,
    '2025-01-19T18:30:00Z'
  ),
  (
    'f8a9b0c1-d2e3-4f4a-5b6c-7d8e9f0a1b2c',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Encontré campera negra en Aula 15',
    'Quedó una campera negra de abrigo (marca Columbia) en el Aula 15 después de la clase de las 20hs del miércoles.',
    'found',
    'Aula 15 - Sede Centro',
    '2025-01-22',
    'clothing',
    false,
    ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
    'active',
    28,
    '2025-01-22T21:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. SERVICES (Servicios)
-- ============================================
INSERT INTO services (
  id, author_id, title, description, service_type, price_range, 
  availability, portfolio_urls, image_urls, status, view_count, favorite_count, created_at
) VALUES
  (
    'a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Diseño Gráfico - Logos, Flyers, Presentaciones',
    'Estudiante de Diseño ofrezco servicios de diseño gráfico. Logos desde $15.000, flyers desde $8.000. Portfolio disponible.',
    'design',
    '$8.000 - $30.000',
    'Lunes a Viernes',
    ARRAY['https://behance.net/ejemplo'],
    ARRAY['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'],
    'active',
    67,
    15,
    '2025-01-17T11:00:00Z'
  ),
  (
    'b0c1d2e3-f4a5-4b6c-7d8e-9f0a1b2c3d4e',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Desarrollo Web - Landing Pages y Apps',
    'Hago páginas web, landing pages y aplicaciones. React, Node.js, bases de datos. Precios accesibles para estudiantes.',
    'programming',
    '$25.000 - $80.000',
    'Flexible',
    ARRAY['https://github.com/ejemplo'],
    ARRAY['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'],
    'active',
    89,
    22,
    '2025-01-15T09:00:00Z'
  ),
  (
    'c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Fotografía para eventos y retratos',
    'Fotógrafa con 3 años de experiencia. Cubro eventos universitarios, retratos para LinkedIn, y sesiones casuales.',
    'photography',
    '$20.000 - $50.000',
    'Fines de semana',
    ARRAY['https://instagram.com/ejemplo'],
    ARRAY['https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400'],
    'active',
    54,
    18,
    '2025-01-18T16:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. TUTORING LISTINGS (Clases Particulares)
-- ============================================
INSERT INTO tutoring_listings (
  id, author_id, title, description, subject, modality, price_per_hour,
  experience, schedule_availability, image_urls, status, view_count, favorite_count, created_at
) VALUES
  (
    'd2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Clases de Análisis Matemático I y II',
    'Estudiante avanzado de Ingeniería. Explico con paciencia, preparo para parciales y finales. Aprobé ambas con 9.',
    'Análisis Matemático',
    'both',
    8000,
    '2 años dando clases',
    'Tardes de Lunes a Jueves',
    ARRAY['https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=400'],
    'active',
    78,
    20,
    '2025-01-16T13:00:00Z'
  ),
  (
    'e3f4a5b6-c7d8-4e9f-0a1b-2c3d4e5f6a7b',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Inglés para exámenes internacionales',
    'Profesora de Inglés (UNLAR). Preparo para FCE, IELTS y TOEFL. También ayudo con inglés técnico para papers.',
    'Inglés',
    'virtual',
    10000,
    'Profesora recibida, 4 años de experiencia',
    'Flexible - consultar',
    ARRAY['https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400'],
    'active',
    45,
    12,
    '2025-01-19T10:00:00Z'
  ),
  (
    'f4a5b6c7-d8e9-4f0a-1b2c-3d4e5f6a7b8c',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Programación en Python y Java - Desde cero',
    'Si estás arrancando Programación I o II, te ayudo a entender los conceptos. Ejercicios prácticos y proyectos.',
    'Programación',
    'both',
    7000,
    '1 año, 15+ alumnos aprobados',
    'Mañanas y noches',
    ARRAY['https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=400'],
    'active',
    92,
    25,
    '2025-01-20T08:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. ANNOUNCEMENTS (Anuncios)
-- ============================================
INSERT INTO announcements (
  id, author_id, title, description, priority, source, target_careers,
  expires_at, image_urls, status, view_count, created_at
) VALUES
  (
    'a5b6c7d8-e9f0-4a1b-2c3d-4e5f6a7b8c9d',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Inscripción a materias - 2do cuatrimestre 2025',
    'Se informa que la inscripción a materias del 2do cuatrimestre estará habilitada del 1 al 15 de julio a través del SIU Guaraní.',
    'important',
    'faculty',
    ARRAY[]::uuid[],
    '2025-07-15T23:59:00Z',
    ARRAY[]::text[],
    'active',
    456,
    '2025-01-22T08:00:00Z'
  ),
  (
    'b6c7d8e9-f0a1-4b2c-3d4e-5f6a7b8c9d0e',
    '44c2f936-b605-488e-a537-e146ad0d40dc',
    'Becas de transporte - Convocatoria abierta',
    'El Centro de Estudiantes informa que están abiertas las becas de transporte para estudiantes del interior. Presentar documentación en Bienestar.',
    'normal',
    'student_center',
    ARRAY[]::uuid[],
    '2025-02-28T23:59:00Z',
    ARRAY[]::text[],
    'active',
    234,
    '2025-01-21T10:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RESUMEN DE DATOS INSERTADOS
-- ============================================
-- ✅ Rentals: 4 registros
-- ✅ Marketplace Items: 4 registros
-- ✅ Forum Posts: 4 registros
-- ✅ Events: 3 registros
-- ✅ Lost & Found Items: 3 registros
-- ✅ Services: 3 registros
-- ✅ Tutoring Listings: 3 registros
-- ✅ Announcements: 2 registros
-- ============================================
-- TOTAL: 26 registros de datos mock migrados
-- ============================================

-- Verificar los datos insertados
SELECT 'Rentals' as tabla, COUNT(*) as total FROM rentals WHERE status = 'active'
UNION ALL
SELECT 'Marketplace', COUNT(*) FROM marketplace_items WHERE status = 'active'
UNION ALL
SELECT 'Forum Posts', COUNT(*) FROM forum_posts WHERE status = 'active'
UNION ALL
SELECT 'Events', COUNT(*) FROM events WHERE status = 'active'
UNION ALL
SELECT 'Lost & Found', COUNT(*) FROM lost_found_items WHERE status = 'active'
UNION ALL
SELECT 'Services', COUNT(*) FROM services WHERE status = 'active'
UNION ALL
SELECT 'Tutoring', COUNT(*) FROM tutoring_listings WHERE status = 'active'
UNION ALL
SELECT 'Announcements', COUNT(*) FROM announcements WHERE status = 'active';
