package com.unlar.ecosistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO (Data Transfer Object) para la respuesta de recomendaciones
 * 
 * Los DTOs se usan para transferir datos entre el backend y el frontend.
 * No son entidades de base de datos, son solo objetos para enviar/recibir datos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    
    /**
     * ID del usuario para quien son las recomendaciones
     */
    private String userId;
    
    /**
     * Lista de eventos recomendados
     */
    private List<EventRecommendation> events;
    
    /**
     * Razón de las recomendaciones
     */
    private String reason;
    
    /**
     * Timestamp de cuando se generaron las recomendaciones
     */
    private String generatedAt;
    
    /**
     * Clase interna para representar un evento recomendado
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventRecommendation {
        private String id;
        private String title;
        private String description;
        private String eventType;
        private String startDate;
        private String location;
        private Boolean isVirtual;
        private Integer availableSpots;
        private Double relevanceScore; // Puntuación de relevancia (0-100)
        private String recommendationReason; // Por qué se recomienda este evento
    }
}
