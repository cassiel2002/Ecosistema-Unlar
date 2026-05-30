# 🚀 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar el backend de Spring Boot en Railway paso a paso.

## 📋 Requisitos previos

- ✅ Cuenta en [Railway](https://railway.app) (puedes usar GitHub para registrarte)
- ✅ Cuenta en [GitHub](https://github.com) 
- ✅ Tu proyecto debe estar en un repositorio de GitHub
- ✅ Base de datos Supabase funcionando

## 🎯 Paso 1: Preparar el repositorio

### 1.1 Crear repositorio en GitHub (si no lo tienes)

```bash
cd ecosistema-backend
git init
git add .
git commit -m "Initial commit - Backend Spring Boot"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ecosistema-backend.git
git push -u origin main
```

### 1.2 Verificar archivos de configuración

Asegúrate de que estos archivos existan en tu proyecto:

- ✅ `nixpacks.toml` - Configuración de build para Railway
- ✅ `Procfile` - Comando de inicio
- ✅ `system.properties` - Versión de Java
- ✅ `.env.example` - Ejemplo de variables de entorno
- ✅ `src/main/resources/application-prod.properties` - Configuración de producción

## 🚂 Paso 2: Crear proyecto en Railway

### 2.1 Acceder a Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway para acceder a tus repositorios
5. Selecciona el repositorio `ecosistema-backend`

### 2.2 Configurar el proyecto

Railway detectará automáticamente que es un proyecto Maven/Spring Boot.

## ⚙️ Paso 3: Configurar variables de entorno

En el dashboard de Railway:

1. Haz clic en tu proyecto
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

```bash
# Puerto (Railway lo asigna automáticamente, pero puedes definir un fallback)
PORT=8080

# Perfil de Spring Boot
SPRING_PROFILES_ACTIVE=prod

# Base de datos Supabase
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=postgres.izameyyymxdlosrdllbb
SPRING_DATASOURCE_PASSWORD=enzocassielfacundo

# CORS - Agrega tu frontend cuando lo despliegues
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://tu-frontend.vercel.app

# Configuración de JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=none
SPRING_JPA_SHOW_SQL=false

# Logging
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_UNLAR_ECOSISTEMA=INFO
```

### ⚠️ IMPORTANTE: Seguridad

**NO subas el archivo `application.properties` con credenciales a GitHub**

Agrega esto a tu `.gitignore`:

```
# Ignorar archivos con credenciales
application.properties
application-*.properties
!application-prod.properties
.env
```

## 🔨 Paso 4: Configurar el build

Railway debería detectar automáticamente el build, pero si no:

1. Ve a **Settings** en tu proyecto
2. En **Build Command**, asegúrate que diga:
   ```bash
   mvn clean package -DskipTests
   ```

3. En **Start Command**, asegúrate que diga:
   ```bash
   java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/ecosistema-backend-0.0.1-SNAPSHOT.jar
   ```

## 🚀 Paso 5: Desplegar

1. Railway comenzará a construir automáticamente
2. Espera a que termine el build (puede tomar 3-5 minutos la primera vez)
3. Una vez completado, verás el estado **"Active"**

## 🌐 Paso 6: Obtener la URL pública

1. En el dashboard de Railway, haz clic en tu servicio
2. Ve a la pestaña **"Settings"**
3. En la sección **"Networking"**, haz clic en **"Generate Domain"**
4. Railway te dará una URL como: `https://ecosistema-backend-production.up.railway.app`

## ✅ Paso 7: Verificar el despliegue

### 7.1 Probar el health check

```bash
curl https://tu-app.up.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "UP",
  "message": "Ecosistema UNLAR API is running"
}
```

### 7.2 Probar Swagger UI

Abre en tu navegador:
```
https://tu-app.up.railway.app/swagger-ui/index.html
```

### 7.3 Probar un endpoint

```bash
curl https://tu-app.up.railway.app/api/rentals
```

## 🔄 Paso 8: Actualizar CORS en el frontend

Una vez que tengas la URL de Railway, actualiza tu frontend:

```typescript
// En tu archivo de configuración de Supabase o API
const API_URL = import.meta.env.PROD 
  ? 'https://tu-app.up.railway.app/api'
  : 'http://localhost:8080/api';
```

Y actualiza la variable `CORS_ALLOWED_ORIGINS` en Railway con la URL de tu frontend en producción.

## 📊 Monitoreo y Logs

### Ver logs en tiempo real

1. En Railway, haz clic en tu servicio
2. Ve a la pestaña **"Deployments"**
3. Haz clic en el deployment activo
4. Verás los logs en tiempo real

### Comandos útiles

```bash
# Ver logs recientes
railway logs

# Ver logs en tiempo real
railway logs --follow
```

## 🐛 Troubleshooting

### Error: "Application failed to start"

**Causa:** Problema con las variables de entorno o conexión a la base de datos

**Solución:**
1. Verifica que todas las variables de entorno estén configuradas
2. Verifica que la URL de Supabase sea correcta
3. Revisa los logs en Railway

### Error: "Port already in use"

**Causa:** Railway no está usando la variable `$PORT`

**Solución:**
Asegúrate de que el start command use `-Dserver.port=$PORT`

### Error: "CORS policy"

**Causa:** El frontend no está en la lista de orígenes permitidos

**Solución:**
Actualiza `CORS_ALLOWED_ORIGINS` en Railway con la URL de tu frontend

### Error: "Connection refused" a Supabase

**Causa:** Credenciales incorrectas o firewall

**Solución:**
1. Verifica las credenciales en Railway
2. Asegúrate de usar el Transaction Pooler (puerto 6543)
3. Verifica que `sslmode=require` esté en la URL

## 🔄 Redesplegar cambios

Cada vez que hagas push a GitHub, Railway redesplegará automáticamente:

```bash
git add .
git commit -m "Actualización del backend"
git push origin main
```

Railway detectará el push y comenzará un nuevo deployment.

## 💰 Costos

Railway ofrece:
- **$5 USD de crédito gratis al mes** (suficiente para desarrollo)
- **500 horas de ejecución gratis** para proyectos pequeños
- Después de eso, pagas por uso (~$5-10/mes para proyectos pequeños)

## 📝 Checklist final

Antes de considerar el despliegue completo:

- [ ] Backend desplegado en Railway
- [ ] Health check funcionando
- [ ] Swagger UI accesible
- [ ] Endpoints devuelven datos de Supabase
- [ ] CORS configurado correctamente
- [ ] Frontend actualizado con la URL de producción
- [ ] Variables de entorno seguras (sin credenciales en el código)

## 🎉 ¡Listo!

Tu backend está ahora en producción. Puedes compartir la URL de Swagger con tu equipo:

```
https://tu-app.up.railway.app/swagger-ui/index.html
```

## 📚 Recursos adicionales

- [Documentación de Railway](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Spring Boot en Railway](https://docs.railway.app/guides/spring-boot)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Verifica las variables de entorno
3. Consulta la documentación de Railway
4. Pregunta en el Discord de Railway
