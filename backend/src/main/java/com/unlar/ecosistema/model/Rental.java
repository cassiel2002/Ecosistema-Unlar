package com.unlar.ecosistema.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad que representa un alquiler
 */
@Entity
@Table(name = "rentals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rental {
    
    @Id
    @Column(name = "id", columnDefinition = "uuid")
    private String id;
    
    @Column(name = "author_id", nullable = false)
    private String authorId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private RentalType type;
    
    @Column(name = "price", nullable = false)
    private Integer price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private Currency currency = Currency.ARS;
    
    @Column(name = "location", nullable = false)
    private String location;
    
    @Column(name = "neighborhood", nullable = false)
    private String neighborhood;
    
    // PostgreSQL array - Spring Boot lo maneja automáticamente
    @Column(name = "amenities", columnDefinition = "text[]")
    private String[] amenities;
    
    @Column(name = "image_urls", columnDefinition = "text[]")
    private String[] imageUrls;
    
    @Column(name = "available_from")
    private LocalDate availableFrom;
    
    @Column(name = "allows_pets")
    private Boolean allowsPets = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender_preference")
    private GenderPreference genderPreference = GenderPreference.any;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.active;
    
    @Column(name = "is_pinned")
    private Boolean isPinned = false;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    @Column(name = "favorite_count")
    private Integer favoriteCount = 0;
    
    @Column(name = "report_count")
    private Integer reportCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Enums - Los valores deben coincidir con los de Supabase (lowercase)
     */
    public enum RentalType {
        apartment, room, shared;
        
        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }
    
    public enum Currency {
        ARS, USD
    }
    
    public enum GenderPreference {
        any, male, female;
        
        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }
    
    public enum Status {
        active, paused, closed, removed;
        
        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }
    
    /**
     * Método que se ejecuta antes de persistir (crear)
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (id == null || id.isEmpty()) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
    
    /**
     * Método que se ejecuta antes de actualizar
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
