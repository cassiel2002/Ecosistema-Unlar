# 📦 Resumen: Archivos creados para Railway

## ✅ Archivos de configuración creados

1. **`nixpacks.toml`** - Configuración de build para Railway (Java 21 + Maven)
2. **`Procfile`** - Comando de inicio de la aplicación
3. **`system.properties`** - Especifica versión de Java y Maven
4. **`.env.example`** - Plantilla de variables de entorno
5. **`src/main/resources/application-prod.properties`** - Configuración de producción

## 📚 Documentación creada

1. **`RAILWAY_QUICKSTART.md`** - Guía rápida (5 minutos)
2. **`DESPLEGAR_RAILWAY.md`** - Guía completa paso a paso

## 🚀 Próximos pasos

### 1. Sube tu código a GitHub

```bash
cd ecosistema-backend
git add .
git commit -m "Configuración para Railway"
git push origin main
```

### 2. Variables de entorno en Railway

Copia estas variables en Railway Dashboard → Variables:

```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=postgres.izameyyymxdlosrdllbb
SPRING_DATASOURCE_PASSWORD=enzocassielfacundo
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Despliega en Railway

1. Ve a [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Selecciona `ecosistema-backend`
4. Agrega las variables de entorno
5. **Generate Domain** en Settings → Networking

### 4. Verifica

```bash
curl https://tu-app.up.railway.app/api/health
```

## 🎯 URLs importantes

- **API Base**: `https://tu-app.up.railway.app/api`
- **Swagger UI**: `https://tu-app.up.railway.app/swagger-ui/index.html`
- **Health Check**: `https://tu-app.up.railway.app/api/health`

## 📖 Lee la documentación

- **Inicio rápido**: [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)
- **Guía completa**: [DESPLEGAR_RAILWAY.md](./DESPLEGAR_RAILWAY.md)

## ⚠️ Importante

- **NO subas credenciales** a GitHub (ya está en `.gitignore`)
- **Actualiza CORS** cuando despliegues el frontend
- **Usa variables de entorno** en Railway para las credenciales

## 💡 Tips

- Railway redespliega automáticamente con cada `git push`
- Los logs están en Railway Dashboard → Deployments
- El primer build toma ~3-5 minutos
- Railway ofrece $5 USD gratis al mes

## 🆘 ¿Problemas?

1. Revisa los logs en Railway
2. Verifica las variables de entorno
3. Lee [DESPLEGAR_RAILWAY.md](./DESPLEGAR_RAILWAY.md) sección Troubleshooting
