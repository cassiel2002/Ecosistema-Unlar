package com.unlar.ecosistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para transferir datos de Rental
 * Se usa para las respuestas de la API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentalDTO {
    private String id;
    private String authorId;
    private String title;
    private String description;
    private String type;
    private Integer price;
    private String currency;
    private String location;
    private String neighborhood;
    private String[] amenities;
    private String[] imageUrls;
    private LocalDate availableFrom;
    private Boolean allowsPets;
    private String genderPreference;
    private String status;
    private Boolean isPinned;
    private Integer viewCount;
    private Integer favoriteCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
