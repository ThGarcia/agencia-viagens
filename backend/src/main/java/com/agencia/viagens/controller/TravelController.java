package com.agencia.viagens.controller;

import com.agencia.viagens.model.Travel;
import com.agencia.viagens.service.TravelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travels")
public class TravelController {

    private final TravelService travelService;

    public TravelController(TravelService travelService) {
        this.travelService = travelService;
    }

    @PostMapping
    public Travel create(@RequestBody Travel travel) {
        return travelService.create(travel);
    }

    @GetMapping
    public List<Travel> list() {
        return travelService.findAll();
    }
}
