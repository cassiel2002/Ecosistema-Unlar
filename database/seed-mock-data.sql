-- ============================================
-- Script para insertar datos mock en Supabase
-- ============================================
-- Ejecutar este script en Supabase SQL Editor
-- https://app.supabase.com -> SQL Editor -> New Query

-- IMPORTANTE: Este script asume que ya tienes un usuario creado
-- Reemplaza 'USER_ID_AQUI' con el ID real de un usuario de prueba

-- ============================================
-- 1. RENTALS (Alquileres)
-- ============================================
INSERT INTO rentals (
    id, author_id, title, description, type, price, currency, 
    location, neighborhood, amenities, image_urls, available_from, 
    allows_pets, gender_preference, status, view_count, favorite_count
) VALUES
(
    gen_random_uuid(),
    'USER_ID_AQUI', -- Reemplazar con un user_id real
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
    12
),
(
    'mock-rental-2',
    'USER_ID_AQUI',
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
    8
),
(
    'mock-rental-3',
    'USER_ID_AQUI',
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
    23
),
(
    'mock-rental-4',
    'USER_ID_AQUI',
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
    5
);

-- ============================================
-- 2. MARKETPLACE ITEMS (Compra/Venta)
-- ============================================
INSERT INTO marketplace_items (
    id, author_id, title, description, category, price, 
    condition, is_free, image_urls, status, view_count, favorite_count
) VALUES
(
    'mock-market-1',
    'USER_ID_AQUI',
    'Calculadora Científica Casio fx-991ES',
    'Calculadora en excelente estado, la usé solo 1 cuatrimestre para Análisis Matemático. Viene con funda.',
    'electronics',
    25000,
    'like_new',
    false,
    ARRAY['https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400'],
    'active',
    18,
    4
),
(
    'mock-market-2',
    'USER_ID_AQUI',
    'Apuntes completos de Derecho Civil I',
    'Apuntes impresos y anillados del Prof. García, incluye resúmenes y casos prácticos. Todo el programa 2024.',
    'notes',
    5000,
    'good',
    false,
    ARRAY['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400'],
    'active',
    34,
    11
),
(
    'mock-market-3',
    'USER_ID_AQUI',
    'Notebook Lenovo IdeaPad 3 - Impecable',
    'Lenovo IdeaPad 3, i5 11va gen, 8GB RAM, 256GB SSD. Batería dura 5hs. Ideal para programar o estudiar.',
    'electronics',
    450000,
    'good',
    false,
    ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
    'active',
    56,
    19
),
(
    'mock-market-4',
    'USER_ID_AQUI',
    'Libros de Anatomía - REGALO',
    'Ya me recibí y regalo mis libros de Anatomía de Rouvière (3 tomos). Retiro por Ciudad Universitaria.',
    'books',
    NULL,
    'fair',
    true,
    ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    'active',
    89,
    31
);

-- ============================================
-- 3. FORUM POSTS (Foro)
-- ============================================
INSERT INTO forum_posts (
    id, author_id, title, description, category, tags, 
    upvotes, downvotes, comment_count, is_answered, 
    status, view_count
) VALUES
(
    'mock-forum-1',
    'USER_ID_AQUI',
    '¿Alguien cursó Álgebra con el Prof. Martínez?',
    'Estoy por anotarme en la comisión de la mañana. ¿Cómo es el parcial? ¿Toma mucha teoría o es más práctico?',
    'question',
    ARRAY['álgebra', 'ingeniería', 'parciales'],
    15,
    1,
    8,
    true,
    'active',
    120
),
(
    'mock-forum-2',
    'USER_ID_AQUI',
    'Review: Cursada de Programación I (2024)',
    'Les cuento mi experiencia cursando Programación I este año. Tips para aprobar, qué estudiar y cómo organizarse.',
    'review',
    ARRAY['programación', 'sistemas', 'review'],
    42,
    3,
    23,
    false,
    'active',
    340
),
(
    'mock-forum-3',
    'USER_ID_AQUI',
    '¿Dónde sacar la libreta universitaria?',
    'Soy ingresante 2025 y no encuentro info sobre dónde tramitar la libreta. ¿Es en Alumnado o en la sede de mi carrera?',
    'question',
    ARRAY['ingresantes', 'trámites', 'libreta'],
    8,
    0,
    5,
    true,
    'active',
    67
),
(
    'mock-forum-4',
    'USER_ID_AQUI',
    'Recomendación: Mejor bar para estudiar cerca de la facu',
    'Busco un lugar tranquilo con WiFi bueno para estudiar entre clases. ¿Alguna recomendación por la zona de UNLAR?',
    'recommendation',
    ARRAY['recomendación', 'estudio', 'bares'],
    25,
    2,
    14,
    false,
    'active',
    198
);

-- ============================================
-- 4. EVENTS (Eventos)
-- ============================================
INSERT INTO events (
    id, author_id, title, description, event_type, 
    start_date, end_date, location, is_virtual, virtual_link,
    max_attendees, current_attendees, registration_required, 
    organizer, image_urls, status, view_count
) VALUES
(
    'mock-event-1',
    'USER_ID_AQUI',
    'Hackathon UNLAR 2025',
    '48 horas de programación, innovación y premios. Equipos de hasta 4 personas. Inscripción gratuita para estudiantes UNLAR.',
    'hackathon',
    '2025-03-15 09:00:00',
    '2025-03-17 18:00:00',
    'Aula Magna - Ciudad Universitaria',
    false,
    NULL,
    100,
    67,
    true,
    'Departamento de Sistemas',
    ARRAY['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400'],
    'active',
    234
),
(
    'mock-event-2',
    'USER_ID_AQUI',
    'Charla: Inteligencia Artificial en la Educación',
    'El Dr. López presenta las últimas tendencias en IA aplicada a la educación universitaria. Entrada libre.',
    'talk',
    '2025-02-20 18:00:00',
    '2025-02-20 20:00:00',
    'Salón de Actos - Sede Centro',
    true,
    'https://meet.google.com/abc-defg-hij',
    NULL,
    45,
    false,
    'Centro de Estudiantes',
    ARRAY['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'],
    'active',
    156
),
(
    'mock-event-3',
    'USER_ID_AQUI',
    'Torneo Interfacultades de Fútbol 5',
    'Torneo relámpago de fútbol 5. Inscribí a tu equipo representando tu carrera. Premios para los 3 primeros.',
    'tournament',
    '2025-02-28 15:00:00',
    '2025-02-28 21:00:00',
    'Cancha sintética - Polideportivo UNLAR',
    false,
    NULL,
    80,
    52,
    true,
    'Secretaría de Bienestar Estudiantil',
    ARRAY['https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400'],
    'active',
    189
);

-- ============================================
-- 5. LOST & FOUND ITEMS (Perdidos/Encontrados)
-- ============================================
INSERT INTO lost_found_items (
    id, author_id, title, description, item_type, 
    location_found, date_found, category, is_resolved, 
    image_urls, status, view_count
) VALUES
(
    'mock-lost-1',
    'USER_ID_AQUI',
    'Encontré llaves con llavero de River',
    'Encontré un juego de llaves (3 llaves + control de portón) con un llavero de River Plate en el pasillo del 2do piso.',
    'found',
    'Facultad de Cs. Exactas - 2do piso',
    '2025-01-20',
    'keys',
    false,
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],
    'active',
    45
),
(
    'mock-lost-2',
    'USER_ID_AQUI',
    'Perdí mi pendrive Kingston 64GB',
    'Se me cayó un pendrive negro Kingston de 64GB en algún lugar entre el buffet y la biblioteca. Tiene archivos importantes de mi tesis.',
    'lost',
    'Biblioteca Central / Buffet',
    '2025-01-19',
    'electronics',
    false,
    ARRAY[]::text[],
    'active',
    32
),
(
    'mock-lost-3',
    'USER_ID_AQUI',
    'Encontré campera negra en Aula 15',
    'Quedó una campera negra de abrigo (marca Columbia) en el Aula 15 después de la clase de las 20hs del miércoles.',
    'found',
    'Aula 15 - Sede Centro',
    '2025-01-22',
    'clothing',
    false,
    ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
    'active',
    28
);

-- ============================================
-- 6. SERVICES (Servicios)
-- ============================================
INSERT INTO services (
    id, author_id, title, description, service_type, 
    price_range, availability, portfolio_urls, image_urls, 
    status, view_count, favorite_count
) VALUES
(
    'mock-service-1',
    'USER_ID_AQUI',
    'Diseño Gráfico - Logos, Flyers, Presentaciones',
    'Estudiante de Diseño ofrezco servicios de diseño gráfico. Logos desde $15.000, flyers desde $8.000. Portfolio disponible.',
    'design',
    '$8.000 - $30.000',
    'Lunes a Viernes',
    ARRAY['https://behance.net/ejemplo'],
    ARRAY['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'],
    'active',
    67,
    15
),
(
    'mock-service-2',
    'USER_ID_AQUI',
    'Desarrollo Web - Landing Pages y Apps',
    'Hago páginas web, landing pages y aplicaciones. React, Node.js, bases de datos. Precios accesibles para estudiantes.',
    'programming',
    '$25.000 - $80.000',
    'Flexible',
    ARRAY['https://github.com/ejemplo'],
    ARRAY['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'],
    'active',
    89,
    22
),
(
    'mock-service-3',
    'USER_ID_AQUI',
    'Fotografía para eventos y retratos',
    'Fotógrafa con 3 años de experiencia. Cubro eventos universitarios, retratos para LinkedIn, y sesiones casuales.',
    'photography',
    '$20.000 - $50.000',
    'Fines de semana',
    ARRAY['https://instagram.com/ejemplo'],
    ARRAY['https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400'],
    'active',
    54,
    18
);

-- ============================================
-- 7. TUTORING LISTINGS (Clases Particulares)
-- ============================================
INSERT INTO tutoring_listings (
    id, author_id, title, description, subject, 
    modality, price_per_hour, experience, schedule_availability, 
    image_urls, status, view_count, favorite_count
) VALUES
(
    'mock-tutoring-1',
    'USER_ID_AQUI',
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
    20
),
(
    'mock-tutoring-2',
    'USER_ID_AQUI',
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
    12
),
(
    'mock-tutoring-3',
    'USER_ID_AQUI',
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
    25
);

-- ============================================
-- 8. ANNOUNCEMENTS (Anuncios)
-- ============================================
INSERT INTO announcements (
    id, author_id, title, description, priority, 
    source, target_careers, expires_at, image_urls, 
    status, view_count
) VALUES
(
    'mock-announcement-1',
    'USER_ID_AQUI',
    'Inscripción a materias - 2do cuatrimestre 2025',
    'Se informa que la inscripción a materias del 2do cuatrimestre estará habilitada del 1 al 15 de julio a través del SIU Guaraní.',
    'important',
    'faculty',
    ARRAY[]::text[],
    '2025-07-15 23:59:00',
    ARRAY[]::text[],
    'active',
    456
),
(
    'mock-announcement-2',
    'USER_ID_AQUI',
    'Becas de transporte - Convocatoria abierta',
    'El Centro de Estudiantes informa que están abiertas las becas de transporte para estudiantes del interior. Presentar documentación en Bienestar.',
    'normal',
    'student_center',
    ARRAY[]::text[],
    '2025-02-28 23:59:00',
    ARRAY[]::text[],
    'active',
    234
);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta estas queries para verificar que se insertaron los datos:

SELECT COUNT(*) as total_rentals FROM rentals WHERE id LIKE 'mock-%';
SELECT COUNT(*) as total_marketplace FROM marketplace_items WHERE id LIKE 'mock-%';
SELECT COUNT(*) as total_forum FROM forum_posts WHERE id LIKE 'mock-%';
SELECT COUNT(*) as total_events FROM events WHERE id LIKE 'mock-%';
SELECT COUNT(*) as total_lost_found FROM lost_found_items WHERE id LIKE 'mock-%';
SELECT COUNT(*) as total_services FROM services WHERE id LIKE 'mock-%';
SELECT COUNT(*) as total_tutoring FROM tutoring_listings WHERE id LIKE 'mock-%';
SELECT COUNT(*) as total_announcements FROM announcements WHERE id LIKE 'mock-%';
