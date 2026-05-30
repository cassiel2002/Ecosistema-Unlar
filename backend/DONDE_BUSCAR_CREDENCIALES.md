# 🔍 DÓNDE BUSCAR LAS CREDENCIALES DE BASE DE DATOS

## ⚠️ IMPORTANTE: API URL ≠ Database URL

### ❌ NO uses esto (es para el frontend):
```
https://izameyyymxdlosrdllbb.supabase.co  ← API URL (REST)
```

### ✅ Necesitas esto (para Spring Boot):
```
postgresql://HOST:PORT/postgres  ← Database Connection String
```

---

## 📋 PASO A PASO - Cómo encontrar la Database URL

### 1️⃣ Abre tu navegador y ve a:
```
https://supabase.com/dashboard/project/izameyyymxdlosrdllbb/settings/database
```

### 2️⃣ Busca la sección que dice:
```
Connection string
```

### 3️⃣ Verás dos pestañas/opciones:
- **Transaction mode** ← Usa esta (puerto 6543)
- **Session mode** ← O esta (puerto 5432)

### 4️⃣ Copia el texto que aparece, se verá así:
```
postgresql://postgres.izameyyymxdlosrdllbb:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### 5️⃣ Identifica las partes:
```
postgresql://[USUARIO]:[PASSWORD]@[HOST]:[PUERTO]/[DATABASE]
           ↓          ↓           ↓      ↓        ↓
    postgres.xxx  tu-pass   aws-0...  6543   postgres
```

---

## 🎯 Lo que necesito que me digas:

Copia y pega aquí la línea completa que dice **"Connection string"** (puedes reemplazar la contraseña con `***` si quieres).

Por ejemplo:
```
postgresql://postgres.izameyyymxdlosrdllbb:***@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

Con eso puedo configurar correctamente el `application.properties`.

---

## 🖼️ Referencia Visual

Busca algo que se vea así en la página:

```
┌─────────────────────────────────────────────────┐
│ Connection string                                │
│                                                  │
│ [Transaction mode] [Session mode]               │
│                                                  │
│ URI                                              │
│ postgresql://postgres.xxx:***@aws-0...          │
│                                                  │
│ JDBC                                             │
│ jdbc:postgresql://aws-0...                       │
└─────────────────────────────────────────────────┘
```

---

## 🆘 Si no encuentras esa sección:

Intenta estas rutas alternativas:

1. **Opción A**: Dashboard → ⚙️ Settings (abajo a la izquierda) → Database
2. **Opción B**: Dashboard → Project Settings → Database
3. **Opción C**: Busca en la barra lateral "Database" → Settings

---

## 📸 O pídele a tu compañero:

"Necesito la **Connection string** de PostgreSQL desde Supabase Dashboard → Settings → Database. Es diferente a la API URL."
