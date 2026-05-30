package com.unlar.ecosistema.service;

import com.unlar.ecosistema.dto.CreateMarketplaceItemRequest;
import com.unlar.ecosistema.dto.MarketplaceItemDTO;
import com.unlar.ecosistema.model.MarketplaceItem;
import com.unlar.ecosistema.repository.MarketplaceItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar items del marketplace
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MarketplaceItemService {
    
    private final MarketplaceItemRepository marketplaceItemRepository;
    
    /**
     * Obtener todos los items activos
     */
    public List<MarketplaceItemDTO> getAllActiveItems() {
        log.info("Obteniendo todos los items activos del marketplace");
        List<MarketplaceItem> items = marketplaceItemRepository.findByStatusOrderByCreatedAtDesc(MarketplaceItem.Status.active);
        log.info("Encontrados {} items", items.size());
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener un item por ID
     */
    public MarketplaceItemDTO getItemById(String id) {
        log.info("Obteniendo item con ID: {}", id);
        MarketplaceItem item = marketplaceItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        
        // Incrementar contador de vistas
        item.setViewCount(item.getViewCount() + 1);
        marketplaceItemRepository.save(item);
        
        return convertToDTO(item);
    }
    
    /**
     * Crear un nuevo item
     */
    @Transactional
    public MarketplaceItemDTO createItem(String authorId, CreateMarketplaceItemRequest request) {
        log.info("Creando nuevo item para usuario: {}", authorId);
        
        MarketplaceItem item = new MarketplaceItem();
        item.setAuthorId(authorId);
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(MarketplaceItem.Category.valueOf(request.getCategory().toLowerCase()));
        item.setPrice(request.getPrice());
        
        // Mapear condición (manejar "new" como caso especial)
        String condition = request.getCondition().toLowerCase();
        if ("new".equals(condition)) {
            item.setCondition(MarketplaceItem.Condition.new_item);
        } else {
            item.setCondition(MarketplaceItem.Condition.valueOf(condition));
        }
        
        item.setIsFree(request.getIsFree());
        item.setImageUrls(request.getImageUrls());
        item.setStatus(MarketplaceItem.Status.active);
        
        MarketplaceItem savedItem = marketplaceItemRepository.save(item);
        log.info("Item creado con ID: {}", savedItem.getId());
        
        return convertToDTO(savedItem);
    }
    
    /**
     * Actualizar un item
     */
    @Transactional
    public MarketplaceItemDTO updateItem(String id, String authorId, CreateMarketplaceItemRequest request) {
        log.info("Actualizando item ID: {}", id);
        
        MarketplaceItem item = marketplaceItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        
        // Verificar que el usuario es el autor
        if (!item.getAuthorId().equals(authorId)) {
            throw new RuntimeException("No tienes permiso para editar este item");
        }
        
        // Actualizar campos
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(MarketplaceItem.Category.valueOf(request.getCategory().toLowerCase()));
        item.setPrice(request.getPrice());
        
        String condition = request.getCondition().toLowerCase();
        if ("new".equals(condition)) {
            item.setCondition(MarketplaceItem.Condition.new_item);
        } else {
            item.setCondition(MarketplaceItem.Condition.valueOf(condition));
        }
        
        item.setIsFree(request.getIsFree());
        item.setImageUrls(request.getImageUrls());
        
        MarketplaceItem updatedItem = marketplaceItemRepository.save(item);
        log.info("Item actualizado: {}", id);
        
        return convertToDTO(updatedItem);
    }
    
    /**
     * Eliminar un item (soft delete)
     */
    @Transactional
    public void deleteItem(String id, String authorId) {
        log.info("Eliminando item ID: {}", id);
        
        MarketplaceItem item = marketplaceItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        
        // Verificar que el usuario es el autor
        if (!item.getAuthorId().equals(authorId)) {
            throw new RuntimeException("No tienes permiso para eliminar este item");
        }
        
        // Soft delete
        item.setStatus(MarketplaceItem.Status.removed);
        marketplaceItemRepository.save(item);
        
        log.info("Item eliminado (soft delete): {}", id);
    }
    
    /**
     * Buscar items por filtros
     */
    public List<MarketplaceItemDTO> searchItems(String category, Integer minPrice, Integer maxPrice, Boolean isFree) {
        log.info("Buscando items con filtros - categoría: {}, precio: {}-{}, gratis: {}", 
                category, minPrice, maxPrice, isFree);
        
        List<MarketplaceItem> items;
        
        if (isFree != null && isFree) {
            items = marketplaceItemRepository.findByIsFreeAndStatus(true, MarketplaceItem.Status.active);
        } else if (minPrice != null && maxPrice != null) {
            items = marketplaceItemRepository.findByPriceRange(minPrice, maxPrice);
        } else if (category != null) {
            items = marketplaceItemRepository.findByCategoryAndStatus(
                    MarketplaceItem.Category.valueOf(category.toLowerCase()), 
                    MarketplaceItem.Status.active
            );
        } else {
            items = marketplaceItemRepository.findByStatusOrderByCreatedAtDesc(MarketplaceItem.Status.active);
        }
        
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener items de un usuario
     */
    public List<MarketplaceItemDTO> getUserItems(String userId) {
        log.info("Obteniendo items del usuario: {}", userId);
        List<MarketplaceItem> items = marketplaceItemRepository.findByAuthorIdOrderByCreatedAtDesc(userId);
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convertir MarketplaceItem a DTO
     */
    private MarketplaceItemDTO convertToDTO(MarketplaceItem item) {
        MarketplaceItemDTO dto = new MarketplaceItemDTO();
        dto.setId(item.getId());
        dto.setAuthorId(item.getAuthorId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setCategory(item.getCategory().name());
        dto.setPrice(item.getPrice());
        dto.setCondition(item.getCondition().toString());
        dto.setIsFree(item.getIsFree());
        dto.setImageUrls(item.getImageUrls());
        dto.setStatus(item.getStatus().name());
        dto.setIsPinned(item.getIsPinned());
        dto.setViewCount(item.getViewCount());
        dto.setFavoriteCount(item.getFavoriteCount());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}
