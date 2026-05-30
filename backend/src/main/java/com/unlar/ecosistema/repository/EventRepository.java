package com.unlar.ecosistema.repository;

import com.unlar.ecosistema.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository para acceder a la tabla events
 */
@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    
    /**
     * Buscar eventos por tipo
     */
    List<Event> findByEventType(Event.EventType eventType);
    
    /**
     * Buscar eventos activos
     */
    List<Event> findByStatus(Event.Status status);
    
    /**
     * Buscar eventos próximos (que aún no han pasado)
     * 
     * @Query: Permite escribir queries personalizadas en JPQL
     * JPQL es similar a SQL pero usa nombres de clases y atributos Java
     */
    @Query("SELECT e FROM Event e WHERE e.startDate > :now AND e.status = 'ACTIVE' ORDER BY e.startDate ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);
    
    /**
     * Buscar eventos por tipo que sean próximos
     */
    @Query("SELECT e FROM Event e WHERE e.eventType = :type AND e.startDate > :now AND e.status = 'ACTIVE' ORDER BY e.startDate ASC")
    List<Event> findUpcomingEventsByType(@Param("type") Event.EventType type, @Param("now") LocalDateTime now);
    
    /**
     * Buscar eventos populares (más vistos)
     */
    @Query("SELECT e FROM Event e WHERE e.status = 'ACTIVE' ORDER BY e.viewCount DESC, e.favoriteCount DESC")
    List<Event> findPopularEvents();
    
    /**
     * Buscar eventos con cupos disponibles
     */
    @Query("SELECT e FROM Event e WHERE e.status = 'ACTIVE' AND e.maxAttendees IS NOT NULL AND e.currentAttendees < e.maxAttendees ORDER BY e.startDate ASC")
    List<Event> findEventsWithAvailableSpots();
}
