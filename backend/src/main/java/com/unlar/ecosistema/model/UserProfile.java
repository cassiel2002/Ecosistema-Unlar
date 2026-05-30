package com.unlar.ecosistema.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad que representa un perfil de usuario
 * 
 * @Entity: Indica que esta clase es una entidad JPA (tabla de BD)
 * @Table: Especifica el nombre de la tabla en la base de datos
 * @Data: Lombok genera getters, setters, toString, equals, hashCode
 * @NoArgsConstructor: Lombok genera constructor sin parámetros
 * @AllArgsConstructor: Lombok genera constructor con todos los parámetros
 */
@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    
    /**
     * @Id: Indica que este campo es la clave primaria
     * @Column: Especifica detalles de la columna en la BD
     * columnDefinition = "uuid": Indica que es un UUID en PostgreSQL
     */
    @Id
    @Column(name = "id", columnDefinition = "uuid")
    private String id;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "career_id")
    private String careerId;
    
    @Column(name = "enrollment_year")
    private Integer enrollmentYear;
    
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "contact_phone")
    private String contactPhone;
    
    @Column(name = "contact_instagram")
    private String contactInstagram;
    
    @Column(name = "reputation_score")
    private Integer reputationScore = 0;
    
    @Column(name = "is_verified")
    private Boolean isVerified = false;
    
    @Column(name = "is_freshman")
    private Boolean isFreshman = false;
    
    /**
     * @Enumerated: Indica que este campo es un enum
     * EnumType.STRING: Guarda el nombre del enum en la BD (no el ordinal)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole role = UserRole.STUDENT;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Enum para los roles de usuario
     */
    public enum UserRole {
        STUDENT,
        MODERATOR,
        ADMIN
    }
}
