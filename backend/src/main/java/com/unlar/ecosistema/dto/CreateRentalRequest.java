package com.unlar.ecosistema.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO para crear un nuevo alquiler
 * Incluye validaciones
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRentalRequest {
    
    @NotBlank(message = "El título es obligatorio")
    private String title;
    
    @NotBlank(message = "La descripción es obligatoria")
    private String description;
    
    @NotBlank(message = "El tipo es obligatorio")
    private String type; // apartment, room, shared
    
    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser positivo")
    private Integer price;
    
    private String currency = "ARS";
    
    @NotBlank(message = "La ubicación es obligatoria")
    private String location;
    
    @NotBlank(message = "El barrio es obligatorio")
    private String neighborhood;
    
    private String[] amenities;
    private String[] imageUrls;
    private LocalDate availableFrom;
    private Boolean allowsPets = false;
    private String genderPreference = "any";
}
