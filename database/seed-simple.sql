-- ============================================
-- Script SIMPLIFICADO para insertar datos mock
-- ============================================
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Crear usuario de prueba (si no existe)
INSERT INTO user_profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@unlar.edu.ar',
  'Usuario de Prueba',
  'student',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Paso 2: Insertar Rentals
INSERT INTO rentals (
    id, author_id, title, description, type, price, currency, 
    location, neighborhood, amenities, image_urls, available_from, 
    allows_pets, gender_preference, status, view_count, favorite_count, created_at, updated_at
) VALUES
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
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
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
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
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
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
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
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
    NOW(),
    NOW()
);

-- Paso 3: Insertar Marketplace Items
INSERT INTO marketplace_items (
    id, author_id, title, description, category, price, 
    condition, is_free, image_urls, status, view_count, favorite_count, created_at, updated_at
) VALUES
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
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
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
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
    NOW(),
    NOW()
);

-- Paso 4: Insertar Events
INSERT INTO events (
    id, author_id, title, description, event_type, 
    start_date, end_date, location, is_virtual, 
    max_attendees, current_attendees, registration_required, 
    organizer, image_urls, status, view_count, created_at, updated_at
) VALUES
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Hackathon UNLAR 2025',
    '48 horas de programación, innovación y premios. Equipos de hasta 4 personas. Inscripción gratuita para estudiantes UNLAR.',
    'hackathon',
    '2025-03-15 09:00:00',
    '2025-03-17 18:00:00',
    'Aula Magna - Ciudad Universitaria',
    false,
    100,
    67,
    true,
    'Departamento de Sistemas',
    ARRAY['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400'],
    'active',
    234,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Charla: Inteligencia Artificial en la Educación',
    'El Dr. López presenta las últimas tendencias en IA aplicada a la educación universitaria. Entrada libre.',
    'talk',
    '2025-02-20 18:00:00',
    '2025-02-20 20:00:00',
    'Salón de Actos - Sede Centro',
    true,
    NULL,
    45,
    false,
    'Centro de Estudiantes',
    ARRAY['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'],
    'active',
    156,
    NOW(),
    NOW()
);

-- Verificación
SELECT 'Rentals insertados:' as tabla, COUNT(*) as total FROM rentals WHERE author_id = '00000000-0000-0000-0000-000000000001'::uuid
UNION ALL
SELECT 'Marketplace insertados:', COUNT(*) FROM marketplace_items WHERE author_id = '00000000-0000-0000-0000-000000000001'::uuid
UNION ALL
SELECT 'Events insertados:', COUNT(*) FROM events WHERE author_id = '00000000-0000-0000-0000-000000000001'::uuid;
