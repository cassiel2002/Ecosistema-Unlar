# 📡 API Endpoints - Ecosistema UNLAR Backend

## 🏠 Base URL

```
http://localhost:8080
```

---

## 🏘️ Rentals (Alquileres)

### 1. Listar todos los alquileres activos

```http
GET /api/rentals
```

**Respuesta:**
```json
[
  {
    "id": "mock-rental-1",
    "authorId": "user-123",
    "title": "Depto 2 ambientes a 3 cuadras de UNLAR",
    "description": "Departamento luminoso...",
    "type": "apartment",
    "price": 180000,
    "currency": "ARS",
    "location": "Av. Ortiz de Ocampo 1450",
    "neighborhood": "Centro",
    "amenities": ["WiFi", "Cocina", "Lavarropas"],
    "imageUrls": ["https://..."],
    "availableFrom": "2025-03-01",
    "allowsPets": false,
    "genderPreference": "any",
    "status": "active",
    "isPinned": false,
    "viewCount": 45,
    "favoriteCount": 12,
    "createdAt": "2025-01-15T10:00:00",
    "updatedAt": "2025-01-15T10:00:00"
  }
]
```

### 2. Obtener un alquiler por ID

```http
GET /api/rentals/{id}
```

**Ejemplo:**
```http
GET /api/rentals/mock-rental-1
```

### 3. Buscar alquileres con filtros

```http
GET /api/rentals/search?type={type}&minPrice={min}&maxPrice={max}&neighborhood={barrio}
```

**Parámetros opcionales:**
- `type`: apartment, room, shared
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo
- `neighborhood`: Nombre del barrio

**Ejemplos:**
```http
GET /api/rentals/search?type=apartment
GET /api/rentals/search?minPrice=100000&maxPrice=200000
GET /api/rentals/search?neighborhood=Centro
GET /api/rentals/search?type=room&maxPrice=100000
```

### 4. Obtener alquileres de un usuario

```http
GET /api/rentals/user/{userId}
```

**Ejemplo:**
```http
GET /api/rentals/user/123e4567-e89b-12d3-a456-426614174000
```

### 5. Crear un nuevo alquiler

```http
POST /api/rentals
Headers:
  X-User-Id: {userId}
  Content-Type: application/json
```

**Body:**
```json
{
  "title": "Depto 2 ambientes a 3 cuadras de UNLAR",
  "description": "Departamento luminoso con balcón...",
  "type": "apartment",
  "price": 180000,
  "currency": "ARS",
  "location": "Av. Ortiz de Ocampo 1450",
  "neighborhood": "Centro",
  "amenities": ["WiFi", "Cocina", "Lavarropas", "Balcón"],
  "imageUrls": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"],
  "availableFrom": "2025-03-01",
  "allowsPets": false,
  "genderPreference": "any"
}
```

**Respuesta:** 201 Created + objeto creado

### 6. Actualizar un alquiler

```http
PUT /api/rentals/{id}
Headers:
  X-User-Id: {userId}
  Content-Type: application/json
```

**Body:** Mismo formato que POST

**Respuesta:** 200 OK + objeto actualizado

### 7. Eliminar un alquiler

```http
DELETE /api/rentals/{id}
Headers:
  X-User-Id: {userId}
```

**Respuesta:** 204 No Content

---

## 🎯 Recommendations (Recomendaciones)

### 1. Obtener recomendaciones de eventos

```http
GET /api/recommendations/events/{userId}
```

**Ejemplo:**
```http
GET /api/recommendations/events/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "events": [
    {
      "id": "event-123",
      "title": "Hackathon UNLAR 2025",
      "description": "48 horas de programación...",
      "eventType": "hackathon",
      "startDate": "2025-03-15T09:00:00",
      "location": "Aula Magna",
      "isVirtual": false,
      "availableSpots": 33,
      "relevanceScore": 85.0,
      "recommendationReason": "Recomendado por: hackathon, 33 cupos disponibles, próximamente"
    }
  ],
  "reason": "Encontramos 10 eventos que podrían interesarte",
  "generatedAt": "2026-05-29T22:00:00"
}
```

### 2. Health check

```http
GET /api/recommendations/health
```

---

## ✅ Health Check General

```http
GET /api/health
```

**Respuesta:**
```json
{
  "status": "UP",
  "message": "Ecosistema UNLAR Backend está funcionando correctamente",
  "timestamp": "2026-05-29T22:00:00",
  "version": "0.0.1"
}
```

---

## 🔐 Autenticación

Por ahora, la autenticación se maneja mediante el header `X-User-Id`:

```http
X-User-Id: 123e4567-e89b-12d3-a456-426614174000
```

**Nota:** En producción, esto debería reemplazarse con JWT tokens o similar.

---

## 📝 Códigos de respuesta HTTP

- `200 OK` - Petición exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Recurso eliminado exitosamente
- `400 Bad Request` - Datos inválidos
- `403 Forbidden` - No tienes permiso
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## 🧪 Cómo probar los endpoints

### Opción 1: Navegador (solo GET)
```
http://localhost:8080/api/rentals
```

### Opción 2: curl
```bash
# GET
curl http://localhost:8080/api/rentals

# POST
curl -X POST http://localhost:8080/api/rentals \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user-123" \
  -d '{
    "title": "Depto 2 ambientes",
    "description": "Departamento luminoso...",
    "type": "apartment",
    "price": 180000,
    "currency": "ARS",
    "location": "Av. Ortiz de Ocampo 1450",
    "neighborhood": "Centro",
    "amenities": ["WiFi", "Cocina"],
    "imageUrls": [],
    "allowsPets": false,
    "genderPreference": "any"
  }'
```

### Opción 3: Postman
1. Importa la colección (crear archivo JSON con los endpoints)
2. Configura el environment con la base URL
3. Ejecuta las peticiones

### Opción 4: Desde React
```javascript
// GET
fetch('http://localhost:8080/api/rentals')
  .then(res => res.json())
  .then(data => console.log(data));

// POST
fetch('http://localhost:8080/api/rentals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-Id': userId
  },
  body: JSON.stringify({
    title: 'Depto 2 ambientes',
    description: 'Departamento luminoso...',
    type: 'apartment',
    price: 180000,
    currency: 'ARS',
    location: 'Av. Ortiz de Ocampo 1450',
    neighborhood: 'Centro',
    amenities: ['WiFi', 'Cocina'],
    imageUrls: [],
    allowsPets: false,
    genderPreference: 'any'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🚀 Próximos endpoints a implementar

- [ ] Marketplace Items (Compra/Venta)
- [ ] Forum Posts (Foro)
- [ ] Events (Eventos)
- [ ] Lost & Found (Perdidos/Encontrados)
- [ ] Services (Servicios)
- [ ] Tutoring (Clases Particulares)
- [ ] Announcements (Anuncios)
- [ ] Comments (Comentarios)
- [ ] Favorites (Favoritos)
- [ ] Search Global (Búsqueda global)

---

## 📚 Documentación adicional

- **GUIA_APRENDIZAJE.md** - Conceptos de Spring Boot
- **FUNCIONALIDAD_RECOMENDACIONES.md** - Sistema de recomendaciones
- **README.md** - Documentación general del proyecto
