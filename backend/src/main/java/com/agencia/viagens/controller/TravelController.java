    package com.agencia.viagens.controller;

    import com.agencia.viagens.dto.*;
    import com.agencia.viagens.service.TravelService;
    import io.swagger.v3.oas.annotations.Operation;
    import io.swagger.v3.oas.annotations.responses.ApiResponse;
    import io.swagger.v3.oas.annotations.responses.ApiResponses;
    import io.swagger.v3.oas.annotations.tags.Tag;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.UUID;

    @Tag(name = "Admin - Viagens", description = "Gerenciamento de viagens (CRUD completo com ativação e desativação)")
    @RestController
    @RequestMapping("/viagens")
    @CrossOrigin("*")
    public class TravelController {

        private final TravelService service;

        public TravelController(TravelService service) {
            this.service = service;
        }

        @Operation(
                summary = "Criar nova viagem",
                description = """
                        Cadastra uma nova viagem com todas as informações necessárias.
                        A viagem já é criada como ACTIVE por padrão.
                        """
        )
        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "Viagem criada com sucesso"),
                @ApiResponse(responseCode = "400", description = "Erro nos dados enviados")
        })
        @PostMapping
        public TravelResponseDTO create(@RequestBody TravelRequestDTO dto) {
            return service.create(dto);
        }

        @Operation(
                summary = "Listar todas as viagens",
                description = "Retorna todas as viagens, incluindo ativas e inativas."
        )
        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
        @GetMapping
        public List<TravelResponseDTO> getAll() {
            return service.findAll();
        }

        @Operation(
                summary = "Listar viagens ativas",
                description = "Retorna apenas viagens disponíveis para venda (ACTIVE)."
        )
        @ApiResponse(responseCode = "200", description = "Lista de viagens ativas")
        @GetMapping("/ativas")
        public List<TravelResponseDTO> getActive() {
            return service.findActive();
        }

        @Operation(
                summary = "Buscar viagem por ID",
                description = "Retorna os detalhes completos de uma viagem específica."
        )
        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "Viagem encontrada"),
                @ApiResponse(responseCode = "404", description = "Viagem não encontrada")
        })
        @GetMapping("/{id}")
        public TravelResponseDTO getById(@PathVariable UUID id) {
            return service.findById(id);
        }

        @Operation(
                summary = "Atualizar viagem",
                description = "Atualiza todas as informações de uma viagem existente."
        )
        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "Viagem atualizada com sucesso"),
                @ApiResponse(responseCode = "404", description = "Viagem não encontrada")
        })
        @PutMapping("/{id}")
        public TravelResponseDTO update(@PathVariable UUID id,
                                        @RequestBody TravelRequestDTO dto) {
            return service.update(id, dto);
        }

        @Operation(
                summary = "Ativar viagem",
                description = "Define a viagem como ACTIVE (disponível para venda)."
        )
        @ApiResponse(responseCode = "200", description = "Viagem ativada com sucesso")
        @PatchMapping("/{id}/ativar")
        public void activate(@PathVariable UUID id) {
            service.activate(id);
        }

        @Operation(
                summary = "Desativar viagem",
                description = "Define a viagem como INACTIVE (indisponível para venda, mas mantida no sistema)."
        )
        @ApiResponse(responseCode = "200", description = "Viagem desativada com sucesso")
        @PatchMapping("/{id}/desativar")
        public void deactivate(@PathVariable UUID id) {
            service.deactivate(id);
        }
    }
