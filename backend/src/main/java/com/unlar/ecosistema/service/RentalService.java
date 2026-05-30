package com.unlar.ecosistema.service;

import com.unlar.ecosistema.dto.CreateRentalRequest;
import com.unlar.ecosistema.dto.RentalDTO;
import com.unlar.ecosistema.model.Rental;
import com.unlar.ecosistema.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar alquileres
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RentalService {
    
    private final RentalRepository rentalRepository;
    
    /**
     * Obtener todos los alquileres activos
     */
    public List<RentalDTO> getAllActiveRentals() {
        log.info("Obteniendo todos los alquileres activos");
        List<Rental> rentals = rentalRepository.findByStatusOrderByCreatedAtDesc(Rental.Status.active);
        log.info("Encontrados {} alquileres", rentals.size());
        
        if (rentals.isEmpty()) {
            log.warn("No se encontraron alquileres. Intentando buscar todos sin filtro...");
            List<Rental> allRentals = rentalRepository.findAll();
            log.info("Total de rentals en BD: {}", allRentals.size());
        }
        
        return rentals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener un alquiler por ID
     */
    public RentalDTO getRentalById(String id) {
        log.info("Obteniendo alquiler con ID: {}", id);
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));
        
        // Incrementar contador de vistas
        rental.setViewCount(rental.getViewCount() + 1);
        rentalRepository.save(rental);
        
        return convertToDTO(rental);
    }
    
    /**
     * Crear un nuevo alquiler
     */
    @Transactional
    public RentalDTO createRental(String authorId, CreateRentalRequest request) {
        log.info("Creando nuevo alquiler para usuario: {}", authorId);
        
        Rental rental = new Rental();
        rental.setAuthorId(authorId);
        rental.setTitle(request.getTitle());
        rental.setDescription(request.getDescription());
        rental.setType(Rental.RentalType.valueOf(request.getType().toUpperCase()));
        rental.setPrice(request.getPrice());
        rental.setCurrency(Rental.Currency.valueOf(request.getCurrency().toUpperCase()));
        rental.setLocation(request.getLocation());
        rental.setNeighborhood(request.getNeighborhood());
        rental.setAmenities(request.getAmenities());
        rental.setImageUrls(request.getImageUrls());
        rental.setAvailableFrom(request.getAvailableFrom());
        rental.setAllowsPets(request.getAllowsPets());
        rental.setGenderPreference(Rental.GenderPreference.valueOf(request.getGenderPreference().toLowerCase()));
        rental.setStatus(Rental.Status.active);
        
        Rental savedRental = rentalRepository.save(rental);
        log.info("Alquiler creado con ID: {}", savedRental.getId());
        
        return convertToDTO(savedRental);
    }
    
    /**
     * Actualizar un alquiler
     */
    @Transactional
    public RentalDTO updateRental(String id, String authorId, CreateRentalRequest request) {
        log.info("Actualizando alquiler ID: {}", id);
        
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));
        
        // Verificar que el usuario es el autor
        if (!rental.getAuthorId().equals(authorId)) {
            throw new RuntimeException("No tienes permiso para editar este alquiler");
        }
        
        // Actualizar campos
        rental.setTitle(request.getTitle());
        rental.setDescription(request.getDescription());
        rental.setType(Rental.RentalType.valueOf(request.getType().toUpperCase()));
        rental.setPrice(request.getPrice());
        rental.setCurrency(Rental.Currency.valueOf(request.getCurrency().toUpperCase()));
        rental.setLocation(request.getLocation());
        rental.setNeighborhood(request.getNeighborhood());
        rental.setAmenities(request.getAmenities());
        rental.setImageUrls(request.getImageUrls());
        rental.setAvailableFrom(request.getAvailableFrom());
        rental.setAllowsPets(request.getAllowsPets());
        rental.setGenderPreference(Rental.GenderPreference.valueOf(request.getGenderPreference().toUpperCase()));
        
        Rental updatedRental = rentalRepository.save(rental);
        log.info("Alquiler actualizado: {}", id);
        
        return convertToDTO(updatedRental);
    }
    
    /**
     * Eliminar un alquiler (soft delete - cambiar estado a REMOVED)
     */
    @Transactional
    public void deleteRental(String id, String authorId) {
        log.info("Eliminando alquiler ID: {}", id);
        
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));
        
        // Verificar que el usuario es el autor
        if (!rental.getAuthorId().equals(authorId)) {
            throw new RuntimeException("No tienes permiso para eliminar este alquiler");
        }
        
        // Soft delete
        rental.setStatus(Rental.Status.removed);
        rentalRepository.save(rental);
        
        log.info("Alquiler eliminado (soft delete): {}", id);
    }
    
    /**
     * Buscar alquileres por filtros
     */
    public List<RentalDTO> searchRentals(String type, Integer minPrice, Integer maxPrice, String neighborhood) {
        log.info("Buscando alquileres con filtros - tipo: {}, precio: {}-{}, barrio: {}", 
                type, minPrice, maxPrice, neighborhood);
        
        List<Rental> rentals;
        
        if (minPrice != null && maxPrice != null) {
            rentals = rentalRepository.findByPriceRange(minPrice, maxPrice);
        } else if (type != null) {
            rentals = rentalRepository.findByType(Rental.RentalType.valueOf(type.toLowerCase()));
        } else if (neighborhood != null) {
            rentals = rentalRepository.findByNeighborhoodAndStatus(neighborhood, Rental.Status.active);
        } else {
            rentals = rentalRepository.findByStatusOrderByCreatedAtDesc(Rental.Status.active);
        }
        
        return rentals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener alquileres de un usuario
     */
    public List<RentalDTO> getUserRentals(String userId) {
        log.info("Obteniendo alquileres del usuario: {}", userId);
        List<Rental> rentals = rentalRepository.findByAuthorIdOrderByCreatedAtDesc(userId);
        return rentals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convertir Rental a RentalDTO
     */
    private RentalDTO convertToDTO(Rental rental) {
        RentalDTO dto = new RentalDTO();
        dto.setId(rental.getId());
        dto.setAuthorId(rental.getAuthorId());
        dto.setTitle(rental.getTitle());
        dto.setDescription(rental.getDescription());
        dto.setType(rental.getType().name());
        dto.setPrice(rental.getPrice());
        dto.setCurrency(rental.getCurrency().name());
        dto.setLocation(rental.getLocation());
        dto.setNeighborhood(rental.getNeighborhood());
        dto.setAmenities(rental.getAmenities());
        dto.setImageUrls(rental.getImageUrls());
        dto.setAvailableFrom(rental.getAvailableFrom());
        dto.setAllowsPets(rental.getAllowsPets());
        dto.setGenderPreference(rental.getGenderPreference().name());
        dto.setStatus(rental.getStatus().name());
        dto.setIsPinned(rental.getIsPinned());
        dto.setViewCount(rental.getViewCount());
        dto.setFavoriteCount(rental.getFavoriteCount());
        dto.setCreatedAt(rental.getCreatedAt());
        dto.setUpdatedAt(rental.getUpdatedAt());
        return dto;
    }
}
