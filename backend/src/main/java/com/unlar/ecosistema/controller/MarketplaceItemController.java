package com.unlar.ecosistema.controller;

import com.unlar.ecosistema.dto.CreateMarketplaceItemRequest;
import com.unlar.ecosistema.dto.MarketplaceItemDTO;
import com.unlar.ecosistema.service.MarketplaceItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gestionar items del marketplace
 */
@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Marketplace", description = "Endpoints para compra/venta de artículos")
public class MarketplaceItemController {
    
    private final MarketplaceItemService marketplaceItemService;
    
    /**
     * GET /api/marketplace - Obtener todos los items activos
     */
    @GetMapping
    @Operation(summary = "Listar todos los items activos", description = "Obtiene todos los artículos del marketplace que están activos")
    public ResponseEntity<List<MarketplaceItemDTO>> getAllItems() {
        log.info("GET /api/marketplace - Obteniendo todos los items");
        List<MarketplaceItemDTO> items = marketplaceItemService.getAllActiveItems();
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/marketplace/{id} - Obtener un item por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener item por ID", description = "Obtiene un artículo específico e incrementa el contador de vistas")
    public ResponseEntity<MarketplaceItemDTO> getItemById(@PathVariable String id) {
        log.info("GET /api/marketplace/{} - Obteniendo item", id);
        MarketplaceItemDTO item = marketplaceItemService.getItemById(id);
        return ResponseEntity.ok(item);
    }
    
    /**
     * POST /api/marketplace - Crear un nuevo item
     */
    @PostMapping
    @Operation(summary = "Crear nuevo item", description = "Crea un nuevo artículo en el marketplace")
    public ResponseEntity<MarketplaceItemDTO> createItem(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateMarketplaceItemRequest request) {
        log.info("POST /api/marketplace - Creando nuevo item para usuario: {}", userId);
        MarketplaceItemDTO createdItem = marketplaceItemService.createItem(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }
    
    /**
     * PUT /api/marketplace/{id} - Actualizar un item
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar item", description = "Actualiza un artículo existente (solo el autor puede hacerlo)")
    public ResponseEntity<MarketplaceItemDTO> updateItem(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateMarketplaceItemRequest request) {
        log.info("PUT /api/marketplace/{} - Actualizando item", id);
        MarketplaceItemDTO updatedItem = marketplaceItemService.updateItem(id, userId, request);
        return ResponseEntity.ok(updatedItem);
    }
    
    /**
     * DELETE /api/marketplace/{id} - Eliminar un item (soft delete)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar item", description = "Elimina un artículo (soft delete - cambia estado a removed)")
    public ResponseEntity<Void> deleteItem(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId) {
        log.info("DELETE /api/marketplace/{} - Eliminando item", id);
        marketplaceItemService.deleteItem(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /api/marketplace/search - Buscar items con filtros
     */
    @GetMapping("/search")
    @Operation(summary = "Buscar items", description = "Busca artículos por categoría, rango de precio o si son gratis")
    public ResponseEntity<List<MarketplaceItemDTO>> searchItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Boolean isFree) {
        log.info("GET /api/marketplace/search - Buscando items con filtros");
        List<MarketplaceItemDTO> items = marketplaceItemService.searchItems(category, minPrice, maxPrice, isFree);
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/marketplace/user/{userId} - Obtener items de un usuario
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Items de un usuario", description = "Obtiene todos los artículos publicados por un usuario específico")
    public ResponseEntity<List<MarketplaceItemDTO>> getUserItems(@PathVariable String userId) {
        log.info("GET /api/marketplace/user/{} - Obteniendo items del usuario", userId);
        List<MarketplaceItemDTO> items = marketplaceItemService.getUserItems(userId);
        return ResponseEntity.ok(items);
    }
}
