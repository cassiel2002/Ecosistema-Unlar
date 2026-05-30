package com.unlar.ecosistema.repository;

import com.unlar.ecosistema.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository para acceder a la tabla user_profiles
 * 
 * @Repository: Indica que esta interfaz es un repositorio (acceso a datos)
 * 
 * JpaRepository<UserProfile, String>:
 * - UserProfile: La entidad que maneja
 * - String: El tipo de dato de la clave primaria (id)
 * 
 * Spring Data JPA genera automáticamente la implementación de estos métodos.
 * No necesitas escribir SQL manualmente.
 */
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    
    /**
     * Buscar usuario por email
     * 
     * Spring Data JPA genera automáticamente la query:
     * SELECT * FROM user_profiles WHERE email = ?
     */
    Optional<UserProfile> findByEmail(String email);
    
    /**
     * Buscar usuario por ID de carrera
     * 
     * Query generada:
     * SELECT * FROM user_profiles WHERE career_id = ?
     */
    java.util.List<UserProfile> findByCareerId(String careerId);
    
    /**
     * Buscar usuarios por año de ingreso
     * 
     * Query generada:
     * SELECT * FROM user_profiles WHERE enrollment_year = ?
     */
    java.util.List<UserProfile> findByEnrollmentYear(Integer year);
    
    /**
     * Buscar usuarios por carrera y año
     * 
     * Query generada:
     * SELECT * FROM user_profiles WHERE career_id = ? AND enrollment_year = ?
     */
    java.util.List<UserProfile> findByCareerIdAndEnrollmentYear(String careerId, Integer year);
}
