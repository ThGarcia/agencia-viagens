package com.agencia.viagens.service;

import com.agencia.viagens.dto.*;
import com.agencia.viagens.model.*;
import com.agencia.viagens.repository.TravelRepository;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

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

        t.setImageUrl(dto.getImageUrl());
        t.setTitle(dto.getTitle());
        t.setSubtitle(dto.getSubtitle());
        t.setDescription(dto.getDescription());
        t.setDepartureDate(dto.getDepartureDate());
        t.setReturnDate(dto.getReturnDate());
        t.setYear(dto.getYear());

        t.setPriceBase(dto.getPriceBase());
        t.setPriceDescription(dto.getPriceDescription());

        t.setInclusions(dto.getInclusions());
        t.setObservations(dto.getObservations());

        t.setSlug(generateSlug(dto.getTitle()));
        t.setStatus(TravelStatus.ACTIVE);

        return toDTO(repository.save(t));
    }

    public TravelResponseDTO update(UUID id, TravelRequestDTO dto) {
        Travel t = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));

        t.setImageUrl(dto.getImageUrl());
        t.setTitle(dto.getTitle());
        t.setSubtitle(dto.getSubtitle());

        t.setSlug(generateSlug(dto.getTitle()));

        t.setDescription(dto.getDescription());
        t.setDepartureDate(dto.getDepartureDate());
        t.setReturnDate(dto.getReturnDate());
        t.setYear(dto.getYear());

        t.setPriceBase(dto.getPriceBase());
        t.setPriceDescription(dto.getPriceDescription());

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

    private String generateSlug(String title) {
        if (title == null) return "";
        String nfdNormalizedString = Normalizer.normalize(title, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String withoutAccents = pattern.matcher(nfdNormalizedString).replaceAll("");

        return withoutAccents.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .trim()
                .replaceAll("\\s+", "-");
    }

    private TravelResponseDTO toDTO(Travel t) {
        return TravelResponseDTO.builder()
                .id(t.getId())
                .imageUrl(t.getImageUrl())
                .title(t.getTitle())
                .subtitle(t.getSubtitle())
                .slug(t.getSlug())
                .description(t.getDescription())
                .departureDate(t.getDepartureDate())
                .returnDate(t.getReturnDate())
                .year(t.getYear())
                .priceBase(t.getPriceBase())
                .priceDescription(t.getPriceDescription())
                .inclusions(t.getInclusions())
                .observations(t.getObservations())
                .status(t.getStatus().name())
                .build();
    }
}
