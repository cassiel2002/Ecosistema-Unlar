# 📊 Scripts de Base de Datos

## 🎯 Cómo insertar los datos mock en Supabase

### Paso 1: Obtener un User ID

Primero necesitas el ID de un usuario existente en Supabase:

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Table Editor** → **user_profiles**
4. Copia el `id` de cualquier usuario (es un UUID como `123e4567-e89b-12d3-a456-426614174000`)

### Paso 2: Editar el script SQL

1. Abre el archivo `seed-mock-data.sql`
2. Busca todas las ocurrencias de `'USER_ID_AQUI'`
3. Reemplázalas con el ID del usuario que copiaste

**Tip:** En VS Code puedes usar `Ctrl+H` para reemplazar todas las ocurrencias de una vez.

### Paso 3: Ejecutar el script

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Click en **New Query**
5. Copia y pega todo el contenido de `seed-mock-data.sql`
6. Click en **Run** (o presiona `Ctrl+Enter`)

### Paso 4: Verificar

Al final del script hay queries de verificación. Deberías ver:

```
total_rentals: 4
total_marketplace: 4
total_forum: 4
total_events: 3
total_lost_found: 3
total_services: 3
total_tutoring: 3
total_announcements: 2
```

## ✅ Datos insertados

El script inserta:

- **4 Alquileres** (departamentos, habitaciones, compartidos)
- **4 Artículos del Marketplace** (calculadora, apuntes, notebook, libros)
- **4 Posts del Foro** (preguntas, reviews, recomendaciones)
- **3 Eventos** (hackathon, charla, torneo)
- **3 Items de Perdidos/Encontrados** (llaves, pendrive, campera)
- **3 Servicios** (diseño, programación, fotografía)
- **3 Tutorías** (matemática, inglés, programación)
- **2 Anuncios** (inscripciones, becas)

**Total: 26 registros**

## 🔄 Actualizar datos

Si necesitas actualizar los datos:

1. Primero elimina los datos mock:
```sql
DELETE FROM rentals WHERE id LIKE 'mock-%';
DELETE FROM marketplace_items WHERE id LIKE 'mock-%';
DELETE FROM forum_posts WHERE id LIKE 'mock-%';
DELETE FROM events WHERE id LIKE 'mock-%';
DELETE FROM lost_found_items WHERE id LIKE 'mock-%';
DELETE FROM services WHERE id LIKE 'mock-%';
DELETE FROM tutoring_listings WHERE id LIKE 'mock-%';
DELETE FROM announcements WHERE id LIKE 'mock-%';
```

2. Luego ejecuta el script `seed-mock-data.sql` de nuevo

## 🐛 Problemas comunes

### Error: "violates foreign key constraint"

**Causa:** El `author_id` no existe en la tabla `user_profiles`

**Solución:** Verifica que reemplazaste `'USER_ID_AQUI'` con un ID válido

### Error: "duplicate key value"

**Causa:** Los datos ya fueron insertados

**Solución:** Ejecuta las queries de DELETE primero para limpiar los datos anteriores

### Error: "column does not exist"

**Causa:** La estructura de la tabla no coincide con el script

**Solución:** Verifica que las tablas en Supabase tengan todas las columnas necesarias

## 📝 Notas

- Todos los IDs empiezan con `'mock-'` para identificarlos fácilmente
- Las imágenes usan URLs de Unsplash (placeholders)
- Los datos son ficticios pero realistas para la UNLAR
- Puedes modificar el script para agregar más datos o cambiar los existentes

## 🚀 Próximo paso

Una vez que los datos estén en Supabase, el frontend debería mostrarlos automáticamente en lugar de los datos hardcodeados.

Para verificar que funciona:
1. Abre el frontend
2. Navega a cualquier sección (Alquileres, Marketplace, etc.)
3. Deberías ver los datos que acabas de insertar
