package com.agencia.viagens.controller;

import com.agencia.viagens.model.Travel;
import com.agencia.viagens.service.TravelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Viagens", description = "Gerenciamento de viagens disponíveis para contratação")
@RestController
@RequestMapping("/travels")
public class TravelController {

    private final TravelService travelService;

    public TravelController(TravelService travelService) {
        this.travelService = travelService;
    }

    @Operation(
            summary = "Criar nova viagem",
            description = """
                    Cadastra uma nova viagem com informações completas como datas, preço e descrição.
                    O priceBase representa o valor por pessoa."""
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Viagem criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public Travel create(@RequestBody Travel travel) {
        return travelService.create(travel);
    }

    @Operation(
            summary = "Listar todas as viagens",
            description = "Retorna todas as viagens cadastradas no sistema."
    )
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping
    public List<Travel> list() {
        return travelService.findAll();
    }

    @Operation(
            summary = "Buscar viagem por ID",
            description = "Retorna os detalhes de uma viagem específica."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Viagem encontrada"),
            @ApiResponse(responseCode = "404", description = "Viagem não encontrada")
    })
    @GetMapping("/{id}")
    public Travel findById(@PathVariable UUID id) {
        return travelService.findById(id);
    }
}
