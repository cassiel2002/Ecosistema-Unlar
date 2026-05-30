# 🚀 Ecosistema UNLAR - Backend API

Backend desarrollado en **Spring Boot 3.2** con **Java 21** para complementar el ecosistema universitario UNLAR.

## 📋 Requisitos

- ☕ Java 21 (Eclipse Temurin recomendado)
- 📦 Maven 3.8+ (o usar el Maven Wrapper incluido)
- 🐘 PostgreSQL (Supabase)

## 🏗️ Estructura del Proyecto

```
ecosistema-backend/
├── src/
│   ├── main/
│   │   ├── java/com/unlar/ecosistema/
│   │   │   ├── EcosistemaApplication.java    # Clase principal
│   │   │   ├── controller/                    # Endpoints REST (API)
│   │   │   ├── service/                       # Lógica de negocio
│   │   │   ├── model/                         # Entidades de BD
│   │   │   ├── repository/                    # Acceso a datos
│   │   │   ├── dto/                           # Data Transfer Objects
│   │   │   └── config/                        # Configuraciones
│   │   └── resources/
│   │       └── application.properties         # Configuración
│   └── test/                                  # Tests unitarios
├── pom.xml                                    # Dependencias Maven
└── README.md
```

## 🎯 ¿Qué hace cada capa?

### 📡 **Controller** (Capa de Presentación)
- Recibe las peticiones HTTP (GET, POST, PUT, DELETE)
- Valida los datos de entrada
- Llama al Service correspondiente
- Devuelve la respuesta al cliente

**Ejemplo:** `@GetMapping("/api/recommendations")`

### 🧠 **Service** (Capa de Negocio)
- Contiene la lógica de negocio
- Procesa los datos
- Coordina entre diferentes repositorios
- Aplica reglas de negocio

**Ejemplo:** Calcular recomendaciones basadas en intereses del usuario

### 💾 **Repository** (Capa de Datos)
- Accede a la base de datos
- Ejecuta queries
- Hereda de JpaRepository para operaciones CRUD automáticas

**Ejemplo:** `findByUserId(String userId)`

### 📦 **Model** (Entidades)
- Representa las tablas de la base de datos
- Define la estructura de los datos
- Usa anotaciones JPA (@Entity, @Table, @Column)

### 📄 **DTO** (Data Transfer Objects)
- Objetos para transferir datos entre capas
- No son entidades de BD
- Útiles para respuestas personalizadas

## 🚀 Cómo ejecutar

### Opción 1: Usando Maven Wrapper (recomendado)

```bash
# En Windows
.\mvnw.cmd spring-boot:run

# En Linux/Mac
./mvnw spring-boot:run
```

### Opción 2: Usando Maven instalado

```bash
mvn spring-boot:run
```

### Opción 3: Desde tu IDE
- Abre el proyecto en IntelliJ IDEA / Eclipse / VS Code
- Ejecuta la clase `EcosistemaApplication.java`

## ⚙️ Configuración

1. Copia `.env.example` a `.env`
2. Configura las credenciales de Supabase en `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://[TU-HOST]:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=[TU-PASSWORD]
```

## 🔗 Endpoints disponibles

Una vez que agreguemos funcionalidades, los endpoints estarán disponibles en:

```
http://localhost:8080/api/...
```

## 📚 Tecnologías utilizadas

- **Spring Boot 3.2** - Framework principal
- **Spring Data JPA** - ORM para base de datos
- **PostgreSQL** - Base de datos (Supabase)
- **Lombok** - Reduce código boilerplate
- **Maven** - Gestión de dependencias

## 🎓 Aprendiendo Spring Boot

### Conceptos clave:

1. **Inyección de Dependencias**: Spring gestiona los objetos por ti
2. **Anotaciones**: `@RestController`, `@Service`, `@Repository`
3. **JPA**: Mapeo objeto-relacional (no escribes SQL manualmente)
4. **REST API**: Endpoints HTTP para comunicación con el frontend

## 🤝 Contribuir

Este proyecto es parte de la hackaton UNLAR. Para contribuir:

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit: `git commit -m "Agrega nueva funcionalidad"`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request

## 📞 Soporte

Si tienes dudas sobre Spring Boot o el proyecto, consulta:
- [Documentación oficial de Spring Boot](https://spring.io/projects/spring-boot)
- [Guías de Spring](https://spring.io/guides)
