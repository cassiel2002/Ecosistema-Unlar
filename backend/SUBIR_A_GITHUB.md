# 📤 Cómo subir el backend a GitHub

## ✅ Ya está listo localmente

El repositorio git ya está inicializado y con el commit inicial hecho.

## 🚀 Pasos para subir a GitHub

### Opción 1: Crear repositorio en la cuenta de tu amigo (Recomendado)

1. **Ve a GitHub** y entra con la cuenta de tu amigo: https://github.com/cassiel2002
2. **Crea un nuevo repositorio:**
   - Click en el **+** (arriba derecha) → **New repository**
   - **Repository name**: `ecosistema-backend`
   - **Description**: `Backend API REST con Spring Boot para Ecosistema UNLAR`
   - **Visibility**: Public (o Private si prefieres)
   - **NO marques** "Initialize with README" (ya tenemos archivos)
   - Click **Create repository**

3. **Conecta y sube el código:**
   ```bash
   cd ecosistema-backend
   git remote add origin https://github.com/cassiel2002/ecosistema-backend.git
   git push -u origin main
   ```

### Opción 2: Crear repositorio en tu cuenta

Si prefieres tenerlo en tu cuenta:

1. **Ve a tu GitHub**: https://github.com/TU_USUARIO
2. Sigue los mismos pasos de arriba
3. Conecta con tu URL:
   ```bash
   cd ecosistema-backend
   git remote add origin https://github.com/TU_USUARIO/ecosistema-backend.git
   git push -u origin main
   ```

## 📋 Comandos listos para copiar

Una vez que hayas creado el repositorio en GitHub, ejecuta:

```bash
# Ir a la carpeta del backend
cd "D:\Users\Facundo\Desktop\Ecosist unlar\ecosistema-backend"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/cassiel2002/ecosistema-backend.git

# Subir el código
git push -u origin main
```

## ✅ Verificar

Después del push, deberías ver en GitHub:
- ✅ 54 archivos
- ✅ Carpeta `src/` con el código Java
- ✅ Archivos de configuración de Railway
- ✅ Documentación completa

## 🚂 Siguiente paso: Railway

Una vez que el código esté en GitHub:

1. Ve a [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Selecciona `ecosistema-backend`
4. Sigue la guía: [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)

## 🆘 ¿Problemas?

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USUARIO/ecosistema-backend.git
```

### Error: "Permission denied"
Asegúrate de estar autenticado en GitHub:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Error al hacer push
Si pide credenciales, usa un **Personal Access Token** en lugar de contraseña:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Marca: `repo` (Full control of private repositories)
4. Usa el token como contraseña

## 📝 Resumen

```bash
# 1. Crear repo en GitHub (manual en la web)
# 2. Conectar y subir:
cd ecosistema-backend
git remote add origin https://github.com/cassiel2002/ecosistema-backend.git
git push -u origin main

# 3. Desplegar en Railway (lee RAILWAY_QUICKSTART.md)
```

¡Listo! 🎉
