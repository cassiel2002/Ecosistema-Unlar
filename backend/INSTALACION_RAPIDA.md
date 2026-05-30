# ⚡ Instalación Rápida - Ecosistema UNLAR Backend

## ✅ Lo que ya tienes

- ☕ Java 21 instalado y funcionando
- 📁 Proyecto Spring Boot creado con toda la estructura

## ❌ Lo que falta

- 📦 **Maven** - Herramienta para compilar y gestionar dependencias

## 🚀 Opción 1: Usar IntelliJ IDEA (MÁS FÁCIL - Recomendado)

### 1. Descarga IntelliJ IDEA Community (Gratis)
- Ve a: https://www.jetbrains.com/idea/download/
- Descarga la versión **Community** (es gratis)
- Instala normalmente

### 2. Abre el proyecto
1. Abre IntelliJ IDEA
2. Click en **Open**
3. Selecciona la carpeta `ecosistema-backend`
4. Espera a que IntelliJ descargue las dependencias (barra de progreso abajo)

### 3. Configura Supabase
1. Abre `src/main/resources/application.properties`
2. Cambia estas líneas con tus credenciales de Supabase:
```properties
spring.datasource.url=jdbc:postgresql://TU-HOST-SUPABASE:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=TU-PASSWORD
```

### 4. Ejecuta el proyecto
1. Busca la clase `EcosistemaApplication.java`
2. Click derecho → **Run 'EcosistemaApplication'**
3. Espera a que inicie (verás el logo de Spring Boot)
4. Abre: http://localhost:8080/api/health

¡Listo! 🎉

---

## 🚀 Opción 2: Instalar Maven manualmente

### 1. Instala Maven

#### Opción A: Con Chocolatey (más fácil)
```powershell
# Abre PowerShell como Administrador y ejecuta:
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Luego instala Maven:
choco install maven -y
```

#### Opción B: Descarga manual
1. Ve a: https://maven.apache.org/download.cgi
2. Descarga: **Binary zip archive** (apache-maven-3.9.6-bin.zip)
3. Extrae en: `C:\Program Files\Apache\maven`
4. Configura variables de entorno:
   - Abre "Editar las variables de entorno del sistema"
   - Click en "Variables de entorno"
   - En "Variables del sistema", click "Nueva":
     - Nombre: `MAVEN_HOME`
     - Valor: `C:\Program Files\Apache\maven`
   - Edita la variable `Path` y agrega: `%MAVEN_HOME%\bin`
5. Abre una **nueva** terminal y verifica:
```bash
mvn -version
```

### 2. Compila el proyecto
```bash
cd ecosistema-backend
mvn clean install -DskipTests
```

### 3. Configura Supabase
Edita `src/main/resources/application.properties` con tus credenciales.

### 4. Ejecuta el proyecto
```bash
mvn spring-boot:run
```

### 5. Prueba que funciona
Abre: http://localhost:8080/api/health

---

## 🚀 Opción 3: Usar VS Code

### 1. Instala VS Code
- Descarga de: https://code.visualstudio.com/

### 2. Instala extensiones
1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Instala:
   - **Extension Pack for Java** (Microsoft)
   - **Spring Boot Extension Pack** (VMware)

### 3. Abre el proyecto
1. File → Open Folder
2. Selecciona `ecosistema-backend`
3. Espera a que descargue dependencias

### 4. Configura y ejecuta
- Configura Supabase en `application.properties`
- Presiona F5 para ejecutar
- Abre: http://localhost:8080/api/health

---

## 📝 Resumen de URLs importantes

Una vez que el proyecto esté corriendo:

- **Health Check**: http://localhost:8080/api/health
- **Info**: http://localhost:8080/api/health/info

---

## ❓ Problemas comunes

### "mvn no se reconoce como comando"
- Maven no está instalado o no está en el PATH
- Solución: Usa IntelliJ IDEA (Opción 1) o instala Maven (Opción 2)

### "Could not connect to database"
- Las credenciales de Supabase son incorrectas
- Solución: Verifica `application.properties`

### "Port 8080 already in use"
- Otro programa usa el puerto 8080
- Solución: Cambia el puerto en `application.properties`:
```properties
server.port=8081
```

---

## 🎓 Próximos pasos

Una vez que el proyecto esté corriendo:

1. ✅ Lee `GUIA_APRENDIZAJE.md` para entender Spring Boot
2. ✅ Explora el código de `HealthController.java`
3. ⬜ Crea tu primera funcionalidad (recomendaciones, búsqueda, etc.)

---

## 💡 Recomendación

**Para aprender Spring Boot, usa IntelliJ IDEA Community Edition.**

Es el IDE más usado para Java/Spring Boot y tiene:
- Autocompletado inteligente
- Detección de errores en tiempo real
- Debugging visual
- Integración con Maven automática
- Gratis y completo

¡Éxito! 🚀
