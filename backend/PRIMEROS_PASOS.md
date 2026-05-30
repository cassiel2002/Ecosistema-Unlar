# 🚀 Primeros Pasos - Ecosistema UNLAR Backend

## ✅ Lo que ya tienes instalado

- ☕ **Java 21** (Eclipse Temurin) - Instalado en: `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`
- 📦 **Maven Wrapper** - Incluido en el proyecto (no necesitas instalar Maven)

## 📁 Estructura creada

```
ecosistema-backend/
├── src/
│   ├── main/
│   │   ├── java/com/unlar/ecosistema/
│   │   │   ├── EcosistemaApplication.java          ✅ Clase principal
│   │   │   ├── controller/
│   │   │   │   └── HealthController.java           ✅ Endpoint de prueba
│   │   │   ├── service/                            📁 Para lógica de negocio
│   │   │   ├── model/                              📁 Para entidades
│   │   │   ├── repository/                         📁 Para acceso a BD
│   │   │   ├── dto/                                📁 Para DTOs
│   │   │   └── config/
│   │   │       └── CorsConfig.java                 ✅ Configuración CORS
│   │   └── resources/
│   │       └── application.properties              ✅ Configuración
│   └── test/                                       📁 Para tests
├── pom.xml                                         ✅ Dependencias Maven
├── build.cmd                                       ✅ Script para compilar
├── run.cmd                                         ✅ Script para ejecutar
├── README.md                                       ✅ Documentación
├── GUIA_APRENDIZAJE.md                            ✅ Guía de aprendizaje
└── .gitignore                                      ✅ Archivos a ignorar
```

## 🎯 Paso 1: Instalar Maven

Necesitas instalar Maven para compilar el proyecto. Hay dos opciones:

### Opción A: Instalar Maven con Chocolatey (Recomendado)

1. Abre PowerShell como Administrador
2. Instala Chocolatey (si no lo tienes):
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
3. Instala Maven:
```powershell
choco install maven -y
```
4. Cierra y abre una nueva terminal

### Opción B: Descargar Maven manualmente

1. Ve a https://maven.apache.org/download.cgi
2. Descarga "Binary zip archive" (apache-maven-3.9.6-bin.zip)
3. Extrae el ZIP en `C:\Program Files\Apache\maven`
4. Agrega a las variables de entorno:
   - Variable: `MAVEN_HOME` = `C:\Program Files\Apache\maven`
   - Agrega a `Path`: `%MAVEN_HOME%\bin`
5. Abre una nueva terminal y verifica: `mvn -version`

### Opción C: Usar tu IDE (Más fácil para principiantes)

Si usas IntelliJ IDEA, Eclipse o VS Code con extensiones de Java, puedes abrir el proyecto directamente y el IDE descargará las dependencias automáticamente.

## 🎯 Paso 1b: Compilar el proyecto

Una vez que tengas Maven instalado:

```bash
cd ecosistema-backend
mvn clean install -DskipTests
```

Esto va a:
1. Descargar todas las dependencias (puede tardar 2-5 minutos la primera vez)
2. Compilar el proyecto

**Nota:** La primera vez descarga muchas librerías (~200MB), ten paciencia.

## 🎯 Paso 2: Configurar la base de datos

Antes de ejecutar, necesitas configurar la conexión a Supabase:

1. Abre `src/main/resources/application.properties`
2. Busca estas líneas:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your-password
```

3. Reemplaza con tus credenciales de Supabase:
   - Ve a https://app.supabase.com
   - Selecciona tu proyecto
   - Ve a **Settings > Database**
   - Copia la **Connection String** (modo URI)
   - Extrae: host, puerto, usuario y contraseña

Ejemplo:
```properties
spring.datasource.url=jdbc:postgresql://db.abcdefghijk.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=tu-password-de-supabase
```

## 🎯 Paso 3: Ejecutar el proyecto

Una vez configurado, ejecuta:

```bash
run.cmd
```

Verás algo como:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.5)

...
Started EcosistemaApplication in 3.456 seconds
```

## 🎯 Paso 4: Probar que funciona

Abre tu navegador y ve a:

```
http://localhost:8080/api/health
```

Deberías ver algo como:

```json
{
  "status": "UP",
  "message": "Ecosistema UNLAR Backend está funcionando correctamente",
  "timestamp": "2024-...",
  "version": "0.0.1"
}
```

También prueba:

```
http://localhost:8080/api/health/info
```

## 🎯 Paso 5: Probar desde el frontend

Si tu frontend React está corriendo en `http://localhost:5173`, puedes hacer:

```javascript
// En tu código React
fetch('http://localhost:8080/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🛠️ Comandos útiles

### Compilar el proyecto
```bash
mvn clean install -DskipTests
```

### Ejecutar el proyecto
```bash
mvn spring-boot:run
```

### Limpiar archivos compilados
```bash
mvn clean
```

### Ejecutar tests
```bash
mvn test
```

### Compilar y crear JAR ejecutable
```bash
mvn package
```

## 🐛 Solución de problemas

### Error: "JAVA_HOME not found"
- Usa los scripts `build.cmd` o `run.cmd` que configuran JAVA_HOME automáticamente
- O configura JAVA_HOME manualmente en las variables de entorno de Windows

### Error: "Could not connect to database"
- Verifica que las credenciales de Supabase en `application.properties` sean correctas
- Verifica que tu IP esté permitida en Supabase (Settings > Database > Connection Pooling)

### Error: "Port 8080 already in use"
- Otro programa está usando el puerto 8080
- Cambia el puerto en `application.properties`: `server.port=8081`

### El proyecto compila pero no arranca
- Revisa los logs en la consola
- Busca líneas que digan "ERROR" o "Exception"
- Copia el error y búscalo en Google o pregúntame

## 📚 Próximos pasos

Una vez que el proyecto esté corriendo:

1. ✅ Lee `GUIA_APRENDIZAJE.md` para entender los conceptos
2. ✅ Explora el código de `HealthController.java`
3. ⬜ Crea tu primera entidad (Model)
4. ⬜ Crea tu primer Repository
5. ⬜ Crea tu primer Service
6. ⬜ Crea tu primer Controller con lógica real

## 🎓 Recursos

- **Documentación del proyecto**: `README.md`
- **Guía de aprendizaje**: `GUIA_APRENDIZAJE.md`
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Tutoriales**: https://spring.io/guides

## 💬 ¿Necesitas ayuda?

Si tienes dudas o errores:
1. Lee los logs completos
2. Busca el error en Google
3. Consulta la documentación oficial
4. Pregunta en el equipo

¡Éxito con tu proyecto! 🚀
