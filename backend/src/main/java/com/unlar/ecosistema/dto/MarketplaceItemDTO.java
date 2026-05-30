package com.unlar.ecosistema.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO para respuestas de MarketplaceItem
 */
@Data
public class MarketplaceItemDTO {
    private String id;
    private String authorId;
    private String title;
    private String description;
    private String category;
    private Integer price;
    private String condition;
    private Boolean isFree;
    private String[] imageUrls;
    private String status;
    private Boolean isPinned;
    private Integer viewCount;
    private Integer favoriteCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
