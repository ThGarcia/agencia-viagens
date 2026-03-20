package com.agencia.viagens.service;

import com.agencia.viagens.model.Travel;
import com.agencia.viagens.repository.TravelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TravelService {

    private final TravelRepository travelRepository;

    public TravelService(TravelRepository travelRepository) {
        this.travelRepository = travelRepository;
    }

    public Travel create(Travel travel) {
        return travelRepository.save(travel);
    }

    public List<Travel> findAll() {
        return travelRepository.findAll();
    }

    public Travel findById(UUID id) {
        return travelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Travel not found"));
    }

    public Travel update(UUID id, Travel updated) {
        Travel travel = findById(id);

        travel.setTitle(updated.getTitle());
        travel.setPriceBase(updated.getPriceBase());
        travel.setDepartureDate(updated.getDepartureDate());

        return travelRepository.save(travel);
    }
}
