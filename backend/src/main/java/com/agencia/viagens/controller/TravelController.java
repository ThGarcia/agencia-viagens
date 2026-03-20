package com.agencia.viagens.controller;

import com.agencia.viagens.model.Travel;
import com.agencia.viagens.repository.TravelRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/travels")
public class TravelController {

    private final TravelRepository travelRepository;

    public TravelController(TravelRepository travelRepository) {
        this.travelRepository = travelRepository;
    }

    @GetMapping
    public List<Travel> findAll() {
        return travelRepository.findAll();
    }

    @GetMapping("/active")
    public List<Travel> findActive() {
        return travelRepository.findByStatus("ACTIVE");
    }

    @PostMapping
    public Travel create(@RequestBody Travel travel) {
        return travelRepository.save(travel);
    }
}
