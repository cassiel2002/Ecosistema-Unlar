# ✅ Configuración Actualizada - Listo para Probar

## 🎯 Credenciales Configuradas

He actualizado `application.properties` con las credenciales correctas:

```properties
Host: db.izameyyymxdlosrdllbb.supabase.co
Puerto: 5432
Database: postgres
Usuario: postgres
Password: enzocassielfacundo
SSL: Requerido
```

---

## 🚀 Cómo Iniciar el Backend

### ⚠️ IMPORTANTE: Abre una NUEVA ventana de PowerShell

Maven fue instalado pero necesitas una nueva ventana para que Windows reconozca el comando `mvn`.

### Opción 1: Usando el script (RECOMENDADO)
```bash
# 1. Abre una NUEVA ventana de PowerShell
# 2. Ve al directorio del proyecto
cd "D:\Users\Facundo\Desktop\Ecosist unlar\ecosistema-backend"

# 3. Ejecuta el script
.\iniciar-backend.cmd
```

### Opción 2: Comando directo
```bash
# 1. Abre una NUEVA ventana de PowerShell
# 2. Ve al directorio del proyecto
cd "D:\Users\Facundo\Desktop\Ecosist unlar\ecosistema-backend"

# 3. Ejecuta Maven
mvn spring-boot:run
```

### Opción 3: Si Maven no se reconoce
```bash
# Cierra TODAS las ventanas de PowerShell
# Reinicia tu computadora
# Abre una nueva PowerShell y prueba:
mvn -version
```

---

## ✅ Señales de Éxito

Si todo funciona correctamente, verás en la consola:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.5)

...
Started EcosistemaApplication in X.XXX seconds (JVM running for X.XXX)
```

Luego puedes probar:
- Health check: http://localhost:8080/api/health
- Rentals: http://localhost:8080/api/rentals

---

## ❌ Posibles Errores

### Error 1: "mvn no se reconoce"
```
El término 'mvn' no se reconoce como nombre de un cmdlet...
```
**Solución**: Abre una NUEVA ventana de PowerShell o reinicia la computadora.

### Error 2: "UnknownHostException"
```
java.net.UnknownHostException: db.izameyyymxdlosrdllbb.supabase.co
```
**Solución**: Problema de red o DNS. Verifica tu conexión a internet.

### Error 3: "Connection refused"
```
Connection refused: connect
```
**Solución**: Supabase puede estar bloqueando la conexión. Verifica en Supabase Dashboard → Settings → Database que no haya restricciones de IP.

### Error 4: "Authentication failed"
```
FATAL: password authentication failed for user "postgres"
```
**Solución**: La contraseña es incorrecta. Verifica que sea: `enzocassielfacundo`

### Error 5: "SSL connection required"
```
FATAL: no pg_hba.conf entry for host
```
**Solución**: Ya está configurado con `?sslmode=require` en la URL.

---

## 🔍 Verificar que Maven está instalado

Abre una NUEVA PowerShell y ejecuta:
```bash
mvn -version
```

Deberías ver:
```
Apache Maven 3.9.16
Maven home: C:\Program Files\Apache\maven\apache-maven-3.9.16
Java version: 21.x.x
```

---

## 📝 Próximos Pasos

Una vez que el backend inicie correctamente:

1. ✅ Probar endpoints con Postman o el navegador
2. ✅ Verificar que puede leer datos de Supabase
3. ✅ Crear/actualizar datos desde el backend
4. ✅ Conectar el frontend React con el backend

---

## 🆘 Si Nada Funciona

Comparte el error completo que aparece en la consola y te ayudo a resolverlo.
