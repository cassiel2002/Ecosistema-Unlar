package com.unlar.ecosistema.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO para crear un nuevo item del marketplace
 */
@Data
public class CreateMarketplaceItemRequest {
    
    @NotBlank(message = "El título es obligatorio")
    private String title;
    
    @NotBlank(message = "La descripción es obligatoria")
    private String description;
    
    @NotBlank(message = "La categoría es obligatoria")
    private String category; // notes, electronics, furniture, books, bikes, other
    
    private Integer price; // Puede ser null si es gratis
    
    @NotBlank(message = "La condición es obligatoria")
    private String condition; // new, like_new, good, fair
    
    @NotNull(message = "Debe indicar si es gratis")
    private Boolean isFree;
    
    private String[] imageUrls;
}
