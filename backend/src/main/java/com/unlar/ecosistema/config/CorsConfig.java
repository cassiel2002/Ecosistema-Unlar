package com.unlar.ecosistema.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Configuración de CORS (Cross-Origin Resource Sharing)
 * 
 * ¿QUÉ ES CORS?
 * Por seguridad, los navegadores bloquean peticiones entre diferentes dominios.
 * Por ejemplo: tu frontend en localhost:5173 no puede llamar a localhost:8080
 * sin configurar CORS.
 * 
 * Esta clase permite que el frontend (React) se comunique con el backend (Spring Boot)
 * 
 * @Configuration: Indica que esta clase contiene configuraciones de Spring
 * @Bean: Indica que el método crea un objeto que Spring gestionará
 */
@Configuration
public class CorsConfig {

    /**
     * Configura CORS para permitir peticiones desde el frontend
     * 
     * IMPORTANTE: En producción, cambia "http://localhost:5173" por tu dominio real
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Permitir credenciales (cookies, headers de autenticación)
        config.setAllowCredentials(true);
        
        // Orígenes permitidos (frontend React en desarrollo)
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000"   // Create React App (por si acaso)
        ));
        
        // Headers permitidos
        config.setAllowedHeaders(Arrays.asList(
            "Origin",
            "Content-Type",
            "Accept",
            "Authorization",
            "X-Requested-With"
        ));
        
        // Métodos HTTP permitidos
        config.setAllowedMethods(Arrays.asList(
            "GET",     // Obtener datos
            "POST",    // Crear datos
            "PUT",     // Actualizar datos completos
            "PATCH",   // Actualizar datos parciales
            "DELETE",  // Eliminar datos
            "OPTIONS"  // Preflight request (automático del navegador)
        ));
        
        // Aplicar configuración a todas las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
