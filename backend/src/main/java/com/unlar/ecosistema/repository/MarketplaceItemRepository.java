package com.unlar.ecosistema.repository;

import com.unlar.ecosistema.model.MarketplaceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para MarketplaceItem
 */
@Repository
public interface MarketplaceItemRepository extends JpaRepository<MarketplaceItem, String> {
    
    // Buscar por status ordenados por fecha
    List<MarketplaceItem> findByStatusOrderByCreatedAtDesc(MarketplaceItem.Status status);
    
    // Buscar por categoría
    List<MarketplaceItem> findByCategoryAndStatus(MarketplaceItem.Category category, MarketplaceItem.Status status);
    
    // Buscar items gratis
    List<MarketplaceItem> findByIsFreeAndStatus(Boolean isFree, MarketplaceItem.Status status);
    
    // Buscar por rango de precio
    @Query("SELECT m FROM MarketplaceItem m WHERE m.price BETWEEN :minPrice AND :maxPrice AND m.status = 'active' ORDER BY m.createdAt DESC")
    List<MarketplaceItem> findByPriceRange(@Param("minPrice") Integer minPrice, @Param("maxPrice") Integer maxPrice);
    
    // Buscar por autor
    List<MarketplaceItem> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    
    // Buscar por condición
    List<MarketplaceItem> findByConditionAndStatus(MarketplaceItem.Condition condition, MarketplaceItem.Status status);
    
    // Buscar más populares
    @Query("SELECT m FROM MarketplaceItem m WHERE m.status = 'active' ORDER BY m.viewCount DESC, m.favoriteCount DESC")
    List<MarketplaceItem> findPopularItems();
}
