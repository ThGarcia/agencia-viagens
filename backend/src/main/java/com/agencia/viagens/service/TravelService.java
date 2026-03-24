package com.agencia.viagens.service;

import com.agencia.viagens.dto.*;
import com.agencia.viagens.model.*;
import com.agencia.viagens.repository.TravelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TravelService {

    private final TravelRepository repository;

    public TravelService(TravelRepository repository) {
        this.repository = repository;
    }

    public List<TravelResponseDTO> findAll() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public List<TravelResponseDTO> findActive() {
        return repository.findByStatus(TravelStatus.ACTIVE)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public TravelResponseDTO findById(UUID id) {
        return toDTO(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada")));
    }

    public TravelResponseDTO create(TravelRequestDTO dto) {
        Travel t = new Travel();

        t.setTitle(dto.getTitle());
        t.setDepartureDate(dto.getDepartureDate());
        t.setReturnDate(dto.getReturnDate());
        t.setPriceBase(dto.getPriceBase());
        t.setImageUrl(dto.getImageUrl());
        t.setInclusions(dto.getInclusions());
        t.setObservations(dto.getObservations());
        t.setStatus(TravelStatus.ACTIVE);

        return toDTO(repository.save(t));
    }

    public TravelResponseDTO update(UUID id, TravelRequestDTO dto) {
        Travel t = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));

        t.setTitle(dto.getTitle());
        t.setDepartureDate(dto.getDepartureDate());
        t.setReturnDate(dto.getReturnDate());
        t.setPriceBase(dto.getPriceBase());
        t.setImageUrl(dto.getImageUrl());
        t.setInclusions(dto.getInclusions());
        t.setObservations(dto.getObservations());

        return toDTO(repository.save(t));
    }

    public void activate(UUID id) {
        Travel t = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        t.setStatus(TravelStatus.ACTIVE);
        repository.save(t);
    }

    public void deactivate(UUID id) {
        Travel t = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        t.setStatus(TravelStatus.INACTIVE);
        repository.save(t);
    }

    private TravelResponseDTO toDTO(Travel t) {
        return new TravelResponseDTO(
                t.getId(),
                t.getTitle(),
                t.getDepartureDate(),
                t.getReturnDate(),
                t.getPriceBase(),
                t.getImageUrl(),
                t.getInclusions(),
                t.getObservations(),
                t.getStatus().name()
        );
    }
}
