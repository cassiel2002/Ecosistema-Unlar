# 🔧 Solución al Problema de Conexión

## 🔍 Diagnóstico

El error `UnknownHostException: db.izameyyymxdlosrdllbb.supabase.co` ocurre porque:

1. ✅ El DNS **SÍ resuelve** el host
2. ❌ Pero solo devuelve dirección **IPv6**: `2600:1f14:359d:9300:cd48:eabc:1d74:6e0a`
3. ❌ Tu red o Java **no soportan IPv6** correctamente

---

## 🎯 Soluciones (en orden de prioridad)

### Solución 1: Usar Connection Pooling de Supabase (RECOMENDADO)

Supabase ofrece un pooler que puede tener mejor soporte de red.

1. Ve a: https://supabase.com/dashboard/project/izameyyymxdlosrdllbb/settings/database

2. Busca la sección **"Connection Pooling"** o **"Transaction mode"**

3. Copia la URI que dice algo como:
   ```
   postgresql://postgres.izameyyymxdlosrdllbb:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

4. Actualiza `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require
   spring.datasource.username=postgres.izameyyymxdlosrdllbb
   spring.datasource.password=enzocassielfacundo
   ```

**¿Por qué funciona?**: El pooler puede tener direcciones IPv4 además de IPv6.

---

### Solución 2: Habilitar IPv6 en tu red

#### Opción A: Verificar IPv6 en Windows
```powershell
# Verificar si IPv6 está habilitado
Get-NetAdapterBinding -ComponentID ms_tcpip6

# Si está deshabilitado, habilitarlo (requiere admin)
Enable-NetAdapterBinding -Name "*" -ComponentID ms_tcpip6
```

#### Opción B: Configurar DNS alternativo
1. Panel de Control → Redes e Internet → Centro de redes y recursos compartidos
2. Click en tu conexión → Propiedades
3. Selecciona "Protocolo de Internet versión 6 (TCP/IPv6)"
4. Marca "Obtener dirección IPv6 automáticamente"
5. Usa DNS: `2001:4860:4860::8888` (Google DNS IPv6)

---

### Solución 3: Usar un túnel o proxy

Si tu ISP no soporta IPv6, puedes usar:

#### Cloudflare WARP (Gratis)
1. Descarga: https://1.1.1.1/
2. Instala y activa WARP
3. Reinicia la aplicación Spring Boot

---

### Solución 4: Forzar IPv4 en Java (YA INTENTADO)

He actualizado `application.properties` para usar la dirección IPv6 directa:
```properties
spring.datasource.url=jdbc:postgresql://[2600:1f14:359d:9300:cd48:eabc:1d74:6e0a]:5432/postgres?sslmode=require
```

Prueba ejecutar de nuevo:
```bash
mvn spring-boot:run
```

---

### Solución 5: Usar Supabase desde otro dispositivo/red

Si nada funciona, el problema es tu red local:

1. **Hotspot móvil**: Conecta tu PC al hotspot de tu celular
2. **Otra red WiFi**: Prueba desde otra ubicación
3. **VPN**: Usa una VPN que soporte IPv6

---

## 🧪 Probar la Solución 1 (Connection Pooling)

Necesito que me digas si en Supabase Dashboard ves una sección llamada:
- "Connection Pooling"
- "Transaction mode"
- "Session mode"

Y si hay una URL diferente a `db.izameyyymxdlosrdllbb.supabase.co`.

---

## 🔍 Diagnóstico Adicional

Ejecuta estos comandos y comparte los resultados:

```powershell
# Ver si IPv6 está habilitado
ipconfig /all | Select-String -Pattern "IPv6"

# Ver rutas IPv6
netsh interface ipv6 show route

# Probar conectividad IPv6
ping -6 google.com
```

---

## 📞 Alternativa: Pedir ayuda a tu compañero

Pídele que:
1. Verifique si hay una **Connection Pooling URL** en Supabase
2. Te comparta esa URL (puede ser diferente y tener IPv4)
3. Verifique si hay restricciones de IP en la configuración de Supabase

---

## 🎯 Próximo Paso Inmediato

**Prueba la Solución 4** que ya configuré:
```bash
mvn spring-boot:run
```

Si falla, **prueba la Solución 1** (necesito que me digas si ves "Connection Pooling" en Supabase).
