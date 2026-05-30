package com.unlar.ecosistema.service;

import com.unlar.ecosistema.dto.RecommendationResponse;
import com.unlar.ecosistema.model.Event;
import com.unlar.ecosistema.model.UserProfile;
import com.unlar.ecosistema.repository.EventRepository;
import com.unlar.ecosistema.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para generar recomendaciones personalizadas
 * 
 * @Service: Indica que esta clase contiene lógica de negocio
 * @RequiredArgsConstructor: Lombok genera un constructor con los campos final
 * @Slf4j: Lombok genera un logger para esta clase
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {
    
    /**
     * Inyección de dependencias
     * Spring automáticamente inyecta estos repositorios
     */
    private final UserProfileRepository userProfileRepository;
    private final EventRepository eventRepository;
    
    /**
     * Genera recomendaciones de eventos para un usuario
     * 
     * @param userId ID del usuario
     * @return Respuesta con eventos recomendados
     */
    public RecommendationResponse getEventRecommendations(String userId) {
        log.info("Generando recomendaciones para usuario: {}", userId);
        
        // 1. Buscar el perfil del usuario
        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        log.debug("Usuario encontrado: {} - Carrera: {}", user.getFullName(), user.getCareerId());
        
        // 2. Obtener eventos próximos
        List<Event> upcomingEvents = eventRepository.findUpcomingEvents(LocalDateTime.now());
        
        log.debug("Eventos próximos encontrados: {}", upcomingEvents.size());
        
        // 3. Calcular relevancia de cada evento
        List<RecommendationResponse.EventRecommendation> recommendations = upcomingEvents.stream()
                .map(event -> calculateEventRelevance(event, user))
                .filter(rec -> rec.getRelevanceScore() > 30.0) // Solo eventos con relevancia > 30%
                .sorted((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()))
                .limit(10) // Top 10 recomendaciones
                .collect(Collectors.toList());
        
        log.info("Recomendaciones generadas: {}", recommendations.size());
        
        // 4. Construir respuesta
        String reason = buildRecommendationReason(user, recommendations.size());
        
        return new RecommendationResponse(
                userId,
                recommendations,
                reason,
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }
    
    /**
     * Calcula la relevancia de un evento para un usuario
     * 
     * Algoritmo simple de scoring:
     * - Eventos académicos: +40 puntos
     * - Eventos de la misma carrera (si aplica): +30 puntos
     * - Eventos con cupos disponibles: +20 puntos
     * - Eventos populares (muchas vistas): +10 puntos
     */
    private RecommendationResponse.EventRecommendation calculateEventRelevance(Event event, UserProfile user) {
        double score = 50.0; // Score base
        List<String> reasons = new ArrayList<>();
        
        // Factor 1: Tipo de evento
        if (event.getEventType() == Event.EventType.ACADEMIC || 
            event.getEventType() == Event.EventType.WORKSHOP) {
            score += 30.0;
            reasons.add("evento académico");
        } else if (event.getEventType() == Event.EventType.HACKATHON) {
            score += 25.0;
            reasons.add("hackathon");
        } else if (event.getEventType() == Event.EventType.TALK) {
            score += 20.0;
            reasons.add("charla");
        }
        
        // Factor 2: Cupos disponibles
        if (event.getMaxAttendees() != null) {
            int availableSpots = event.getMaxAttendees() - event.getCurrentAttendees();
            if (availableSpots > 0) {
                score += 15.0;
                reasons.add(availableSpots + " cupos disponibles");
            } else {
                score -= 20.0; // Penalizar eventos llenos
            }
        }
        
        // Factor 3: Popularidad
        if (event.getViewCount() > 100) {
            score += 10.0;
            reasons.add("evento popular");
        }
        
        // Factor 4: Evento virtual (más accesible)
        if (event.getIsVirtual()) {
            score += 5.0;
            reasons.add("modalidad virtual");
        }
        
        // Factor 5: Proximidad temporal (eventos más cercanos son más relevantes)
        long daysUntilEvent = java.time.temporal.ChronoUnit.DAYS.between(
                LocalDateTime.now(), 
                event.getStartDate()
        );
        if (daysUntilEvent <= 7) {
            score += 15.0;
            reasons.add("próximamente");
        } else if (daysUntilEvent <= 30) {
            score += 5.0;
        }
        
        // Normalizar score a 0-100
        score = Math.min(100.0, Math.max(0.0, score));
        
        // Construir recomendación
        Integer availableSpots = event.getMaxAttendees() != null 
                ? event.getMaxAttendees() - event.getCurrentAttendees() 
                : null;
        
        String recommendationReason = reasons.isEmpty() 
                ? "Evento recomendado para ti" 
                : "Recomendado por: " + String.join(", ", reasons);
        
        return new RecommendationResponse.EventRecommendation(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventType().name().toLowerCase(),
                event.getStartDate().format(DateTimeFormatter.ISO_DATE_TIME),
                event.getLocation(),
                event.getIsVirtual(),
                availableSpots,
                score,
                recommendationReason
        );
    }
    
    /**
     * Construye la razón general de las recomendaciones
     */
    private String buildRecommendationReason(UserProfile user, int recommendationCount) {
        if (recommendationCount == 0) {
            return "No hay eventos disponibles en este momento";
        }
        
        StringBuilder reason = new StringBuilder();
        reason.append("Encontramos ").append(recommendationCount).append(" eventos ");
        
        if (user.getCareerId() != null) {
            reason.append("relacionados con tu carrera ");
        }
        
        reason.append("que podrían interesarte");
        
        return reason.toString();
    }
}
