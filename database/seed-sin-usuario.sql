-- ============================================
-- Script SIN USUARIO - Solo para probar el backend
-- ============================================
-- Este script inserta datos SIN author_id para que puedas probar
-- Luego desde el frontend podrás crear datos con usuarios reales

-- NOTA: Algunos campos author_id quedarán NULL
-- Esto es temporal solo para testing del backend

-- Primero, verificar si la columna author_id permite NULL
-- Si da error, significa que es obligatoria y necesitamos otra solución

-- Insertar Rentals (intentando sin author_id)
INSERT INTO rentals (
    title, description, type, price, currency, 
    location, neighborhood, amenities, image_urls, available_from, 
    allows_pets, gender_preference, status, view_count, favorite_count
) VALUES
(
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

-- Verificación
SELECT 'Rentals insertados:' as resultado, COUNT(*) as total FROM rentals;
