# 🔌 Guía de Conexión a Supabase

## 📍 Información de tu Proyecto
- **Project ID**: `izameyyymxdlosrdllbb`
- **Región**: `us-west-2`
- **Password**: `enzocassielfacundo`

## 🎯 Cómo Obtener las Credenciales Correctas

### Paso 1: Accede a tu Dashboard de Supabase
```
https://supabase.com/dashboard/project/izameyyymxdlosrdllbb
```

### Paso 2: Ve a Database Settings
1. Click en el ícono de **⚙️ Settings** en la barra lateral izquierda
2. Selecciona **Database**
3. Scroll hasta encontrar la sección **"Connection string"**

### Paso 3: Copia la Connection String
Verás dos opciones:

#### 🟢 Transaction Mode (RECOMENDADO para Spring Boot)
- **Puerto**: 6543
- **Uso**: Connection pooling, mejor para aplicaciones
- **Formato**: `postgresql://postgres.izameyyymxdlosrdllbb:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

#### 🟡 Session Mode (Alternativa)
- **Puerto**: 5432
- **Uso**: Conexión directa
- **Formato**: `postgresql://postgres:[PASSWORD]@db.izameyyymxdlosrdllbb.supabase.co:5432/postgres`

### Paso 4: Identifica el HOST correcto
El host puede variar según tu región. Busca algo como:
- `aws-0-us-west-1.pooler.supabase.com` (pooling)
- `aws-0-us-west-2.pooler.supabase.com` (pooling)
- `db.izameyyymxdlosrdllbb.supabase.co` (directo)

## 🔧 Configuraciones para Probar

He actualizado `application.properties` con la configuración más probable. Si no funciona, prueba estas alternativas:

### Configuración 1: Connection Pooling (ACTUAL)
```properties
spring.datasource.url=jdbc:postgresql://aws-0-us-west-1.pooler.supabase.com:6543/postgres
spring.datasource.username=postgres.izameyyymxdlosrdllbb
spring.datasource.password=enzocassielfacundo
```

### Configuración 2: Connection Pooling con usuario simple
```properties
spring.datasource.url=jdbc:postgresql://aws-0-us-west-1.pooler.supabase.com:6543/postgres
spring.datasource.username=postgres
spring.datasource.password=enzocassielfacundo
```

### Configuración 3: Conexión Directa puerto 6543
```properties
spring.datasource.url=jdbc:postgresql://db.izameyyymxdlosrdllbb.supabase.co:6543/postgres
spring.datasource.username=postgres
spring.datasource.password=enzocassielfacundo
```

### Configuración 4: Conexión Directa puerto 5432
```properties
spring.datasource.url=jdbc:postgresql://db.izameyyymxdlosrdllbb.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=enzocassielfacundo
```

## 🚀 Cómo Probar la Conexión

### Opción 1: Desde el proyecto
```bash
cd ecosistema-backend
mvn spring-boot:run
```

### Opción 2: Compilar y ejecutar
```bash
cd ecosistema-backend
mvn clean install -DskipTests
java -jar target/ecosistema-backend-0.0.1-SNAPSHOT.jar
```

## ✅ Señales de Éxito
Si la conexión funciona, verás en la consola:
```
Started EcosistemaApplication in X.XXX seconds
```

## ❌ Errores Comunes

### Error: UnknownHostException
```
java.net.UnknownHostException: db.izameyyymxdlosrdllbb.supabase.co
```
**Solución**: El host es incorrecto. Verifica en Supabase Dashboard.

### Error: Connection refused
```
Connection refused: connect
```
**Solución**: El puerto es incorrecto. Prueba 6543 en lugar de 5432.

### Error: Authentication failed
```
FATAL: password authentication failed for user "postgres"
```
**Solución**: 
- Verifica que la contraseña sea correcta
- Prueba con `postgres.izameyyymxdlosrdllbb` como usuario

### Error: SSL connection required
```
FATAL: no pg_hba.conf entry for host
```
**Solución**: Agrega a `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://HOST:PORT/postgres?sslmode=require
```

## 📝 Próximos Pasos

Una vez que la conexión funcione:

1. ✅ Verificar que las tablas existen en Supabase
2. ✅ Probar el endpoint de health: `http://localhost:8080/api/health`
3. ✅ Probar el endpoint de rentals: `http://localhost:8080/api/rentals`
4. ✅ Crear datos de prueba si es necesario

## 🆘 Si Nada Funciona

Pídele a tu compañero que te envíe:
1. La **Connection String completa** desde Supabase Dashboard → Database Settings
2. Screenshot de la sección "Connection string" (sin mostrar la contraseña)
3. Confirmar que la contraseña es: `enzocassielfacundo`

## 📚 Recursos
- [Supabase Database Settings](https://supabase.com/dashboard/project/izameyyymxdlosrdllbb/settings/database)
- [Spring Boot + PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)
