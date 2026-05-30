# ⚡ Railway - Inicio Rápido

## 🚀 Despliegue en 5 minutos

### 1️⃣ Sube tu código a GitHub

```bash
cd ecosistema-backend
git init
git add .
git commit -m "Backend listo para Railway"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ecosistema-backend.git
git push -u origin main
```

### 2️⃣ Crea proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige tu repositorio `ecosistema-backend`

### 3️⃣ Configura variables de entorno

En Railway Dashboard → Variables, agrega:

```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=postgres.izameyyymxdlosrdllbb
SPRING_DATASOURCE_PASSWORD=enzocassielfacundo
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 4️⃣ Genera dominio público

Settings → Networking → **Generate Domain**

### 5️⃣ Verifica que funcione

```bash
curl https://tu-app.up.railway.app/api/health
```

## ✅ ¡Listo!

Tu API está en: `https://tu-app.up.railway.app`

Swagger UI: `https://tu-app.up.railway.app/swagger-ui/index.html`

---

📖 Para más detalles, lee [DESPLEGAR_RAILWAY.md](./DESPLEGAR_RAILWAY.md)
