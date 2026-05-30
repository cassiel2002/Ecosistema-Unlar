package com.unlar.ecosistema.repository;

import com.unlar.ecosistema.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para acceder a la tabla rentals
 */
@Repository
public interface RentalRepository extends JpaRepository<Rental, String> {
    
    /**
     * Buscar alquileres por tipo
     */
    List<Rental> findByType(Rental.RentalType type);
    
    /**
     * Buscar alquileres por estado
     */
    List<Rental> findByStatus(Rental.Status status);
    
    /**
     * Buscar alquileres activos
     */
    List<Rental> findByStatusOrderByCreatedAtDesc(Rental.Status status);
    
    /**
     * Buscar alquileres por barrio
     */
    List<Rental> findByNeighborhoodAndStatus(String neighborhood, Rental.Status status);
    
    /**
     * Buscar alquileres por rango de precio
     */
    @Query("SELECT r FROM Rental r WHERE r.price BETWEEN :minPrice AND :maxPrice AND r.status = 'ACTIVE' ORDER BY r.price ASC")
    List<Rental> findByPriceRange(@Param("minPrice") Integer minPrice, @Param("maxPrice") Integer maxPrice);
    
    /**
     * Buscar alquileres que permiten mascotas
     */
    List<Rental> findByAllowsPetsAndStatus(Boolean allowsPets, Rental.Status status);
    
    /**
     * Buscar alquileres por autor
     */
    List<Rental> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    
    /**
     * Buscar alquileres populares (más vistos)
     */
    @Query("SELECT r FROM Rental r WHERE r.status = 'ACTIVE' ORDER BY r.viewCount DESC, r.favoriteCount DESC")
    List<Rental> findPopularRentals();
}
