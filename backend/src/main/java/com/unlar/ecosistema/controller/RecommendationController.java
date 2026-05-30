package com.unlar.ecosistema.controller;

import com.unlar.ecosistema.dto.RecommendationResponse;
import com.unlar.ecosistema.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para recomendaciones
 * 
 * @RestController: Indica que esta clase maneja peticiones HTTP y devuelve JSON
 * @RequestMapping: Define la ruta base para todos los endpoints de este controlador
 * @RequiredArgsConstructor: Lombok genera constructor para inyección de dependencias
 * @Slf4j: Lombok genera un logger
 */
@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Slf4j
public class RecommendationController {
    
    /**
     * Inyección del servicio
     */
    private final RecommendationService recommendationService;
    
    /**
     * Endpoint para obtener recomendaciones de eventos
     * 
     * URL: GET http://localhost:8080/api/recommendations/events/{userId}
     * Ejemplo: GET http://localhost:8080/api/recommendations/events/123e4567-e89b-12d3-a456-426614174000
     * 
     * @GetMapping: Indica que este método responde a peticiones GET
     * @PathVariable: Extrae el valor de la URL (userId)
     * 
     * ResponseEntity: Permite controlar el código de estado HTTP y headers
     */
    @GetMapping("/events/{userId}")
    public ResponseEntity<RecommendationResponse> getEventRecommendations(
            @PathVariable String userId) {
        
        log.info("Petición de recomendaciones para usuario: {}", userId);
        
        try {
            RecommendationResponse recommendations = recommendationService.getEventRecommendations(userId);
            
            log.info("Recomendaciones generadas exitosamente para usuario: {}", userId);
            
            // Retornar respuesta con código 200 OK
            return ResponseEntity.ok(recommendations);
            
        } catch (RuntimeException e) {
            log.error("Error al generar recomendaciones para usuario {}: {}", userId, e.getMessage());
            
            // Retornar error 404 Not Found si el usuario no existe
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Endpoint de prueba para verificar que el servicio funciona
     * 
     * URL: GET http://localhost:8080/api/recommendations/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Recommendation service is running");
    }
}
