# 📚 Guía de Aprendizaje - Spring Boot para Principiantes

## 🎯 ¿Qué es Spring Boot?

Spring Boot es un framework de Java que facilita la creación de aplicaciones web y APIs REST. Piensa en él como un conjunto de herramientas que te ahorra escribir mucho código repetitivo.

## 🏗️ Arquitectura del Proyecto (Patrón MVC)

```
Cliente (React)
      ↓
   [HTTP Request]
      ↓
┌─────────────────────┐
│   CONTROLLER        │ ← Recibe peticiones HTTP
│   @RestController   │   Valida datos de entrada
└─────────────────────┘   Devuelve respuestas JSON
      ↓
┌─────────────────────┐
│   SERVICE           │ ← Lógica de negocio
│   @Service          │   Procesa datos
└─────────────────────┘   Aplica reglas
      ↓
┌─────────────────────┐
│   REPOSITORY        │ ← Acceso a base de datos
│   @Repository       │   Queries SQL automáticas
└─────────────────────┘
      ↓
   [Base de Datos]
```

## 📦 Conceptos Fundamentales

### 1️⃣ **Anotaciones** (Annotations)

Las anotaciones son como "etiquetas" que le dicen a Spring qué hacer con cada clase.

```java
@RestController  // "Esta clase maneja peticiones HTTP"
@Service         // "Esta clase contiene lógica de negocio"
@Repository      // "Esta clase accede a la base de datos"
@Entity          // "Esta clase representa una tabla de BD"
```

### 2️⃣ **Inyección de Dependencias** (Dependency Injection)

Spring crea y gestiona los objetos por ti. No necesitas hacer `new MiClase()`.

```java
@RestController
public class MiController {
    
    // Spring automáticamente crea e inyecta el servicio
    private final MiService miService;
    
    // Constructor (Spring lo usa para inyectar)
    public MiController(MiService miService) {
        this.miService = miService;
    }
}
```

### 3️⃣ **Endpoints REST**

Los endpoints son las "puertas de entrada" a tu API.

```java
@GetMapping("/api/users")           // GET - Obtener datos
@PostMapping("/api/users")          // POST - Crear datos
@PutMapping("/api/users/{id}")      // PUT - Actualizar todo
@PatchMapping("/api/users/{id}")    // PATCH - Actualizar parcial
@DeleteMapping("/api/users/{id}")   // DELETE - Eliminar
```

### 4️⃣ **JPA (Java Persistence API)**

JPA te permite trabajar con bases de datos sin escribir SQL manualmente.

```java
@Entity  // Esta clase es una tabla
@Table(name = "users")
public class User {
    
    @Id  // Clave primaria
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "full_name")  // Columna en la BD
    private String fullName;
    
    // Getters y setters...
}
```

## 🔄 Flujo de una Petición HTTP

Ejemplo: El frontend quiere obtener recomendaciones

```
1. Frontend hace: GET http://localhost:8080/api/recommendations

2. Spring recibe la petición y busca el Controller correspondiente
   → @GetMapping("/api/recommendations")

3. Controller llama al Service
   → recommendationService.getRecommendations(userId)

4. Service ejecuta la lógica de negocio
   → Calcula recomendaciones basadas en intereses

5. Service usa Repository para obtener datos de BD
   → userRepository.findById(userId)
   → eventRepository.findByCategory(category)

6. Service procesa y devuelve datos al Controller

7. Controller devuelve JSON al frontend
   → { "recommendations": [...] }
```

## 📝 Ejemplo Completo: Sistema de Recomendaciones

### 1. Entidad (Model)

```java
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    private String id;
    private String fullName;
    private String careerId;
    // ... más campos
}
```

### 2. Repository

```java
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    // Spring genera automáticamente el código SQL
    Optional<UserProfile> findById(String id);
    List<UserProfile> findByCareerId(String careerId);
}
```

### 3. Service

```java
@Service
public class RecommendationService {
    
    private final UserProfileRepository userRepository;
    
    public RecommendationService(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public List<Event> getRecommendations(String userId) {
        // Lógica de negocio aquí
        UserProfile user = userRepository.findById(userId).orElseThrow();
        // ... calcular recomendaciones
        return recommendations;
    }
}
```

### 4. Controller

```java
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    
    private final RecommendationService service;
    
    public RecommendationController(RecommendationService service) {
        this.service = service;
    }
    
    @GetMapping("/{userId}")
    public List<Event> getRecommendations(@PathVariable String userId) {
        return service.getRecommendations(userId);
    }
}
```

## 🛠️ Herramientas Útiles

### Lombok - Reduce código repetitivo

```java
// Sin Lombok (mucho código)
public class User {
    private String id;
    private String name;
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

// Con Lombok (simple)
@Data  // Genera getters, setters, toString, equals, hashCode
public class User {
    private String id;
    private String name;
}
```

### Anotaciones útiles de Lombok:

- `@Data` - Genera getters, setters, toString, equals, hashCode
- `@NoArgsConstructor` - Constructor sin parámetros
- `@AllArgsConstructor` - Constructor con todos los parámetros
- `@Builder` - Patrón Builder para crear objetos

## 🧪 Testing

```java
@SpringBootTest
class RecommendationServiceTest {
    
    @Autowired
    private RecommendationService service;
    
    @Test
    void testGetRecommendations() {
        List<Event> recommendations = service.getRecommendations("user-123");
        assertNotNull(recommendations);
        assertTrue(recommendations.size() > 0);
    }
}
```

## 📚 Recursos para Aprender Más

1. **Documentación Oficial**: https://spring.io/guides
2. **Spring Boot Reference**: https://docs.spring.io/spring-boot/docs/current/reference/html/
3. **Baeldung** (tutoriales): https://www.baeldung.com/spring-boot
4. **YouTube**: Busca "Spring Boot tutorial español"

## 🎓 Próximos Pasos

1. ✅ Entender la estructura del proyecto
2. ✅ Ejecutar la aplicación
3. ⬜ Crear tu primera entidad
4. ⬜ Crear tu primer repository
5. ⬜ Crear tu primer service
6. ⬜ Crear tu primer controller
7. ⬜ Probar con Postman o el frontend

## 💡 Tips para Principiantes

1. **No te preocupes por entender todo de una vez** - Spring Boot tiene mucha "magia" detrás
2. **Usa los logs** - `System.out.println()` o `log.info()` para ver qué pasa
3. **Prueba con Postman** - Antes de conectar con el frontend
4. **Lee los errores** - Spring Boot da mensajes de error muy descriptivos
5. **Copia y modifica** - Empieza copiando ejemplos y modificándolos

## ❓ Preguntas Frecuentes

**P: ¿Por qué usar Spring Boot y no solo Java?**
R: Spring Boot te ahorra escribir mucho código repetitivo (configuración, conexión a BD, etc.)

**P: ¿Qué es un Bean?**
R: Un objeto que Spring crea y gestiona por ti. Usas `@Component`, `@Service`, `@Repository`, etc.

**P: ¿Cuándo uso @Service vs @Repository?**
R: `@Service` para lógica de negocio, `@Repository` para acceso a datos. Es más semántico que funcional.

**P: ¿Necesito saber SQL?**
R: No necesariamente. JPA genera el SQL por ti, pero ayuda entender los conceptos básicos.
