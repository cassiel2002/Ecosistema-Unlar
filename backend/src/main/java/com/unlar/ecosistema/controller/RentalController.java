package com.unlar.ecosistema.controller;

import com.unlar.ecosistema.dto.CreateRentalRequest;
import com.unlar.ecosistema.dto.RentalDTO;
import com.unlar.ecosistema.service.RentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar alquileres
 * 
 * Endpoints disponibles:
 * - GET    /api/rentals              - Listar todos los alquileres activos
 * - GET    /api/rentals/{id}         - Obtener un alquiler por ID
 * - GET    /api/rentals/search       - Buscar alquileres con filtros
 * - GET    /api/rentals/user/{userId} - Obtener alquileres de un usuario
 * - POST   /api/rentals              - Crear un nuevo alquiler
 * - PUT    /api/rentals/{id}         - Actualizar un alquiler
 * - DELETE /api/rentals/{id}         - Eliminar un alquiler
 */
@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@Slf4j
public class RentalController {
    
    private final RentalService rentalService;
    
    /**
     * GET /api/rentals
     * Obtener todos los alquileres activos
     */
    @GetMapping
    public ResponseEntity<List<RentalDTO>> getAllRentals() {
        log.info("GET /api/rentals - Obteniendo todos los alquileres");
        List<RentalDTO> rentals = rentalService.getAllActiveRentals();
        return ResponseEntity.ok(rentals);
    }
    
    /**
     * GET /api/rentals/{id}
     * Obtener un alquiler específico por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RentalDTO> getRentalById(@PathVariable String id) {
        log.info("GET /api/rentals/{} - Obteniendo alquiler", id);
        try {
            RentalDTO rental = rentalService.getRentalById(id);
            return ResponseEntity.ok(rental);
        } catch (RuntimeException e) {
            log.error("Alquiler no encontrado: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * GET /api/rentals/search?type=apartment&minPrice=100000&maxPrice=200000&neighborhood=Centro
     * Buscar alquileres con filtros
     */
    @GetMapping("/search")
    public ResponseEntity<List<RentalDTO>> searchRentals(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String neighborhood) {
        
        log.info("GET /api/rentals/search - Buscando con filtros");
        List<RentalDTO> rentals = rentalService.searchRentals(type, minPrice, maxPrice, neighborhood);
        return ResponseEntity.ok(rentals);
    }
    
    /**
     * GET /api/rentals/user/{userId}
     * Obtener todos los alquileres de un usuario
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RentalDTO>> getUserRentals(@PathVariable String userId) {
        log.info("GET /api/rentals/user/{} - Obteniendo alquileres del usuario", userId);
        List<RentalDTO> rentals = rentalService.getUserRentals(userId);
        return ResponseEntity.ok(rentals);
    }
    
    /**
     * POST /api/rentals
     * Crear un nuevo alquiler
     * 
     * Body JSON:
     * {
     *   "title": "Depto 2 ambientes",
     *   "description": "Departamento luminoso...",
     *   "type": "apartment",
     *   "price": 180000,
     *   "currency": "ARS",
     *   "location": "Av. Ortiz de Ocampo 1450",
     *   "neighborhood": "Centro",
     *   "amenities": ["WiFi", "Cocina"],
     *   "imageUrls": ["https://..."],
     *   "allowsPets": false,
     *   "genderPreference": "any"
     * }
     */
    @PostMapping
    public ResponseEntity<RentalDTO> createRental(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateRentalRequest request) {
        
        log.info("POST /api/rentals - Creando nuevo alquiler para usuario: {}", userId);
        try {
            RentalDTO rental = rentalService.createRental(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(rental);
        } catch (Exception e) {
            log.error("Error al crear alquiler: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * PUT /api/rentals/{id}
     * Actualizar un alquiler existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<RentalDTO> updateRental(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateRentalRequest request) {
        
        log.info("PUT /api/rentals/{} - Actualizando alquiler", id);
        try {
            RentalDTO rental = rentalService.updateRental(id, userId, request);
            return ResponseEntity.ok(rental);
        } catch (RuntimeException e) {
            log.error("Error al actualizar alquiler: {}", e.getMessage());
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    /**
     * DELETE /api/rentals/{id}
     * Eliminar un alquiler (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId) {
        
        log.info("DELETE /api/rentals/{} - Eliminando alquiler", id);
        try {
            rentalService.deleteRental(id, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error al eliminar alquiler: {}", e.getMessage());
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
