# 🎯 LEE ESTO PRIMERO - Desplegar en Railway

## ✅ Todo está listo para desplegar

He preparado tu backend de Spring Boot para Railway. Aquí está todo lo que necesitas:

## 📦 Archivos creados

### Configuración de Railway
- ✅ `nixpacks.toml` - Build configuration
- ✅ `Procfile` - Start command
- ✅ `system.properties` - Java 21 + Maven
- ✅ `application-prod.properties` - Production config
- ✅ `.env.example` - Environment variables template

### Documentación
- ✅ `RAILWAY_QUICKSTART.md` - **EMPIEZA AQUÍ** (5 minutos)
- ✅ `DESPLEGAR_RAILWAY.md` - Guía completa paso a paso
- ✅ `CHECKLIST_RAILWAY.md` - Checklist de verificación
- ✅ `RAILWAY_RESUMEN.md` - Resumen ejecutivo
- ✅ `RAILWAY_VARIABLES.txt` - Variables de entorno listas para copiar

### Scripts
- ✅ `preparar-railway.cmd` - Script automático de preparación

## 🚀 Pasos para desplegar (RESUMEN)

### 1️⃣ Sube a GitHub (si no lo has hecho)

```bash
cd ecosistema-backend
git add .
git commit -m "Backend listo para Railway"
git push origin main
```

### 2️⃣ Crea proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Click **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige tu repositorio

### 3️⃣ Configura variables de entorno

Abre `RAILWAY_VARIABLES.txt` y copia TODO el contenido en:
**Railway Dashboard → Settings → Variables → Raw Editor**

### 4️⃣ Genera dominio público

**Settings → Networking → Generate Domain**

### 5️⃣ Verifica que funcione

```bash
curl https://tu-app.up.railway.app/api/health
```

## 📖 ¿Necesitas más detalles?

### Para despliegue rápido (5 min)
👉 Lee: **[RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)**

### Para guía completa con troubleshooting
👉 Lee: **[DESPLEGAR_RAILWAY.md](./DESPLEGAR_RAILWAY.md)**

### Para verificar que todo esté bien
👉 Usa: **[CHECKLIST_RAILWAY.md](./CHECKLIST_RAILWAY.md)**

## 🎯 URLs que obtendrás

Después del despliegue tendrás:

- **API Base**: `https://tu-app.up.railway.app/api`
- **Swagger UI**: `https://tu-app.up.railway.app/swagger-ui/index.html`
- **Health Check**: `https://tu-app.up.railway.app/api/health`

## ⚠️ IMPORTANTE

### Antes de desplegar:

1. ✅ Tu código debe estar en GitHub
2. ✅ Verifica que compile: `mvn clean package -DskipTests`
3. ✅ Ten a mano las credenciales de Supabase

### Después de desplegar:

1. ✅ Actualiza CORS con la URL de tu frontend
2. ✅ Prueba todos los endpoints en Swagger
3. ✅ Conecta tu frontend a la nueva URL

## 💰 Costos

Railway ofrece:
- **$5 USD gratis al mes** (suficiente para desarrollo)
- **500 horas de ejecución gratis**
- Después: ~$5-10/mes para proyectos pequeños

## 🆘 ¿Problemas?

1. **Revisa los logs** en Railway Dashboard
2. **Verifica variables de entorno** en Settings → Variables
3. **Lee la sección Troubleshooting** en DESPLEGAR_RAILWAY.md
4. **Prueba localmente** primero

## 🎉 ¡Listo para empezar!

**Siguiente paso:** Abre [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md) y sigue los 5 pasos.

---

**Tiempo estimado total:** 10-15 minutos (incluyendo el build)

**Dificultad:** ⭐⭐☆☆☆ (Fácil)
