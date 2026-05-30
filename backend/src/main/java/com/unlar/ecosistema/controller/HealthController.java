package com.unlar.ecosistema.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de ejemplo para verificar que la API está funcionando
 * 
 * CONCEPTOS CLAVE:
 * 
 * @RestController: Indica que esta clase maneja peticiones HTTP y devuelve JSON
 *                  Es una combinación de @Controller + @ResponseBody
 * 
 * @RequestMapping: Define la ruta base para todos los endpoints de este controlador
 *                  Todos los métodos aquí empezarán con /api/health
 * 
 * @GetMapping: Indica que este método responde a peticiones GET HTTP
 *              GET se usa para OBTENER datos (no modifica nada)
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    /**
     * Endpoint simple para verificar que el servidor está corriendo
     * 
     * URL: GET http://localhost:8080/api/health
     * 
     * Respuesta: { "status": "UP", "timestamp": "2024-..." }
     */
    @GetMapping
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Ecosistema UNLAR Backend está funcionando correctamente");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "0.0.1");
        
        return response;
    }
    
    /**
     * Endpoint adicional con información del sistema
     * 
     * URL: GET http://localhost:8080/api/health/info
     */
    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "Ecosistema UNLAR Backend");
        response.put("description", "API REST para funcionalidades avanzadas del ecosistema universitario");
        response.put("javaVersion", System.getProperty("java.version"));
        response.put("springBootVersion", "3.2.5");
        
        return response;
    }
}
