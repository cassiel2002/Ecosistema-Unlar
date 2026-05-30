# ✅ Checklist de Despliegue en Railway

## 📦 Preparación Local

- [ ] Proyecto compila sin errores: `mvn clean package -DskipTests`
- [ ] Archivos de configuración presentes:
  - [ ] `nixpacks.toml`
  - [ ] `Procfile`
  - [ ] `system.properties`
  - [ ] `application-prod.properties`
  - [ ] `.env.example`
- [ ] `.gitignore` actualizado (no sube credenciales)
- [ ] Código subido a GitHub

## 🚂 Configuración en Railway

- [ ] Cuenta creada en [railway.app](https://railway.app)
- [ ] Proyecto creado desde GitHub repo
- [ ] Variables de entorno configuradas (ver `RAILWAY_VARIABLES.txt`)
- [ ] Build completado exitosamente
- [ ] Dominio público generado

## 🧪 Verificación

- [ ] Health check funciona: `GET /api/health`
- [ ] Swagger UI accesible: `/swagger-ui/index.html`
- [ ] Endpoint de rentals funciona: `GET /api/rentals`
- [ ] Endpoint de marketplace funciona: `GET /api/marketplace-items`
- [ ] CORS configurado correctamente

## 🔄 Integración con Frontend

- [ ] URL de Railway agregada al frontend
- [ ] CORS actualizado con URL del frontend en producción
- [ ] Frontend puede hacer peticiones al backend
- [ ] Datos de Supabase se muestran correctamente

## 📊 Monitoreo

- [ ] Logs revisados (sin errores críticos)
- [ ] Métricas de Railway revisadas
- [ ] Tiempo de respuesta aceptable (<500ms)

## 🎉 Despliegue Completo

- [ ] Backend en producción funcionando
- [ ] Frontend conectado al backend
- [ ] Base de datos Supabase conectada
- [ ] Documentación actualizada con URLs de producción

---

## 🆘 Si algo falla

1. **Revisa los logs** en Railway Dashboard → Deployments
2. **Verifica variables de entorno** en Settings → Variables
3. **Consulta troubleshooting** en `DESPLEGAR_RAILWAY.md`
4. **Prueba localmente** con las mismas variables de entorno

## 📝 Notas

- Primer despliegue: ~3-5 minutos
- Redespliegues: ~2-3 minutos
- Railway redespliega automáticamente con cada `git push`
- Crédito gratis: $5 USD/mes (suficiente para desarrollo)

## 🔗 URLs Importantes

Anota aquí tus URLs de producción:

- **API Base**: `https://__________________.up.railway.app/api`
- **Swagger UI**: `https://__________________.up.railway.app/swagger-ui/index.html`
- **Health Check**: `https://__________________.up.railway.app/api/health`
