# 🎯 Sistema de Recomendaciones - Documentación

## ¿Qué hemos creado?

Un sistema de recomendaciones inteligente que sugiere eventos personalizados a cada usuario basándose en:
- Tipo de evento (académico, hackathon, charla, etc.)
- Disponibilidad de cupos
- Popularidad del evento
- Proximidad temporal
- Modalidad (virtual/presencial)

## 📁 Archivos creados

### 1. **Entidades (Model)** - Representan las tablas de la BD

```
src/main/java/com/unlar/ecosistema/model/
├── UserProfile.java    # Tabla user_profiles
└── Event.java          # Tabla events
```

**¿Qué hacen?**
- Mapean las tablas de PostgreSQL a clases Java
- Usan anotaciones JPA (@Entity, @Table, @Column)
- Lombok genera getters, setters automáticamente

### 2. **Repositories** - Acceso a la base de datos

```
src/main/java/com/unlar/ecosistema/repository/
├── UserProfileRepository.java
└── EventRepository.java
```

**¿Qué hacen?**
- Extienden JpaRepository (Spring Data JPA)
- Spring genera automáticamente las queries SQL
- Métodos como `findById()`, `findByEmail()`, etc.

**Ejemplo:**
```java
// Esto:
Optional<UserProfile> findByEmail(String email);

// Se convierte automáticamente en:
// SELECT * FROM user_profiles WHERE email = ?
```

### 3. **DTOs** - Objetos para transferir datos

```
src/main/java/com/unlar/ecosistema/dto/
└── RecommendationResponse.java
```

**¿Qué hacen?**
- Definen la estructura de las respuestas JSON
- No son entidades de BD, solo para enviar/recibir datos
- Permiten personalizar qué datos se envían al frontend

### 4. **Service** - Lógica de negocio

```
src/main/java/com/unlar/ecosistema/service/
└── RecommendationService.java
```

**¿Qué hace?**
- Contiene el algoritmo de recomendaciones
- Calcula un "score" de relevancia para cada evento
- Filtra y ordena los eventos más relevantes

**Algoritmo de scoring:**
- Eventos académicos/workshops: +30 puntos
- Hackathons: +25 puntos
- Charlas: +20 puntos
- Cupos disponibles: +15 puntos
- Evento popular (>100 vistas): +10 puntos
- Evento virtual: +5 puntos
- Evento próximo (≤7 días): +15 puntos
- Evento lleno: -20 puntos

### 5. **Controller** - Endpoint REST

```
src/main/java/com/unlar/ecosistema/controller/
└── RecommendationController.java
```

**¿Qué hace?**
- Expone el endpoint HTTP
- Recibe peticiones del frontend
- Llama al Service y devuelve JSON

## 🚀 Cómo usar el endpoint

### Endpoint principal

```
GET http://localhost:8080/api/recommendations/events/{userId}
```

**Ejemplo:**
```bash
GET http://localhost:8080/api/recommendations/events/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "events": [
    {
      "id": "event-123",
      "title": "Hackathon UNLAR 2026",
      "description": "Competencia de programación...",
      "eventType": "hackathon",
      "startDate": "2026-06-15T10:00:00",
      "location": "Campus Central",
      "isVirtual": false,
      "availableSpots": 45,
      "relevanceScore": 85.0,
      "recommendationReason": "Recomendado por: hackathon, 45 cupos disponibles, próximamente"
    },
    {
      "id": "event-456",
      "title": "Charla: Inteligencia Artificial",
      "description": "Introducción a IA...",
      "eventType": "talk",
      "startDate": "2026-06-10T14:00:00",
      "location": "Aula Magna",
      "isVirtual": true,
      "availableSpots": null,
      "relevanceScore": 75.0,
      "recommendationReason": "Recomendado por: charla, modalidad virtual, próximamente"
    }
  ],
  "reason": "Encontramos 2 eventos que podrían interesarte",
  "generatedAt": "2026-05-29T22:00:00"
}
```

### Endpoint de health check

```
GET http://localhost:8080/api/recommendations/health
```

**Respuesta:**
```
Recommendation service is running
```

## 🔄 Flujo completo

```
1. Frontend hace petición:
   GET /api/recommendations/events/user-123

2. RecommendationController recibe la petición
   ↓
3. Llama a RecommendationService.getEventRecommendations(user-123)
   ↓
4. Service busca el usuario en UserProfileRepository
   ↓
5. Service busca eventos próximos en EventRepository
   ↓
6. Service calcula relevancia de cada evento
   ↓
7. Service filtra y ordena por relevancia
   ↓
8. Service construye RecommendationResponse
   ↓
9. Controller devuelve JSON al frontend
```

## 🧪 Cómo probar

### Opción 1: Navegador
Abre en tu navegador:
```
http://localhost:8080/api/recommendations/events/TU-USER-ID
```

### Opción 2: Postman
1. Abre Postman
2. Crea una petición GET
3. URL: `http://localhost:8080/api/recommendations/events/TU-USER-ID`
4. Click en "Send"

### Opción 3: curl (terminal)
```bash
curl http://localhost:8080/api/recommendations/events/TU-USER-ID
```

### Opción 4: Desde el frontend React
```javascript
// En tu código React
fetch('http://localhost:8080/api/recommendations/events/' + userId)
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📊 Conceptos clave que aprendiste

### 1. **Arquitectura en capas**
```
Controller (API) → Service (Lógica) → Repository (BD)
```

### 2. **Inyección de Dependencias**
Spring crea y gestiona los objetos por ti:
```java
@RequiredArgsConstructor  // Lombok genera el constructor
private final RecommendationService service;  // Spring lo inyecta
```

### 3. **JPA/Hibernate**
Mapeo objeto-relacional automático:
```java
@Entity  // Esta clase es una tabla
@Table(name = "events")  // Nombre de la tabla
public class Event {
    @Id  // Clave primaria
    private String id;
}
```

### 4. **Spring Data JPA**
Queries automáticas sin escribir SQL:
```java
List<Event> findByEventType(Event.EventType type);
// Spring genera: SELECT * FROM events WHERE event_type = ?
```

### 5. **REST API**
Endpoints HTTP que devuelven JSON:
```java
@GetMapping("/events/{userId}")  // GET /api/recommendations/events/123
public ResponseEntity<RecommendationResponse> getRecommendations(@PathVariable String userId)
```

## 🎓 Próximos pasos

1. ✅ Conectar con Supabase (agregar password en application.properties)
2. ✅ Reiniciar el servidor
3. ✅ Probar el endpoint con un userId real
4. ⬜ Integrar con el frontend React
5. ⬜ Mejorar el algoritmo de recomendaciones
6. ⬜ Agregar más funcionalidades (búsqueda, analytics, etc.)

## 💡 Ideas para mejorar

- Agregar recomendaciones basadas en historial del usuario
- Recomendar posts del foro relacionados
- Sistema de matching de compañeros de estudio
- Notificaciones de eventos recomendados
- Machine Learning para mejorar las recomendaciones

## 🐛 Troubleshooting

### Error: "Usuario no encontrado"
- Verifica que el userId existe en la tabla user_profiles
- Usa un UUID válido

### Error: "Could not connect to database"
- Verifica las credenciales en application.properties
- Asegúrate de que Supabase esté accesible

### No aparecen recomendaciones
- Verifica que hay eventos en la tabla events
- Verifica que los eventos tienen status='ACTIVE'
- Verifica que los eventos son futuros (start_date > now)

---

¡Felicidades! Has creado tu primera funcionalidad backend completa en Spring Boot. 🎉
