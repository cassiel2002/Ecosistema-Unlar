package com.unlar.ecosistema.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad que representa un evento universitario
 */
@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @Column(name = "id", columnDefinition = "uuid")
    private String id;
    
    @Column(name = "author_id", nullable = false)
    private String authorId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    /**
     * @Enumerated: Para campos enum
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(name = "location", nullable = false)
    private String location;
    
    @Column(name = "is_virtual")
    private Boolean isVirtual = false;
    
    @Column(name = "virtual_link")
    private String virtualLink;
    
    @Column(name = "max_attendees")
    private Integer maxAttendees;
    
    @Column(name = "current_attendees")
    private Integer currentAttendees = 0;
    
    @Column(name = "registration_required")
    private Boolean registrationRequired = false;
    
    @Column(name = "organizer", nullable = false)
    private String organizer;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
    
    @Column(name = "is_pinned")
    private Boolean isPinned = false;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    @Column(name = "favorite_count")
    private Integer favoriteCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Enum para tipos de eventos
     */
    public enum EventType {
        HACKATHON,
        TALK,
        WORKSHOP,
        TOURNAMENT,
        SOCIAL,
        ACADEMIC
    }
    
    /**
     * Enum para estados
     */
    public enum Status {
        ACTIVE,
        PAUSED,
        CLOSED,
        REMOVED
    }
}
