package com.unlar.ecosistema.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad que representa un artículo del marketplace (compra/venta)
 */
@Entity
@Table(name = "marketplace_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketplaceItem {
    
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
    @Column(name = "category", nullable = false)
    private Category category;
    
    @Column(name = "price")
    private Integer price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false)
    private Condition condition;
    
    @Column(name = "is_free")
    private Boolean isFree = false;
    
    @Column(name = "image_urls", columnDefinition = "text[]")
    private String[] imageUrls;
    
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
    public enum Category {
        notes, electronics, furniture, books, bikes, other;
        
        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }
    
    public enum Condition {
        new_item("new"), like_new, good, fair;
        
        private final String value;
        
        Condition() {
            this.value = name();
        }
        
        Condition(String value) {
            this.value = value;
        }
        
        @Override
        public String toString() {
            return value;
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
