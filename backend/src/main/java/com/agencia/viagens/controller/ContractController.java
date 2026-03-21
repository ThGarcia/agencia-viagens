package com.agencia.viagens.controller;

import com.agencia.viagens.dto.ContractRequestDTO;
import com.agencia.viagens.dto.ContractResponseDTO;
import com.agencia.viagens.model.Contract;
import com.agencia.viagens.repository.ContractRepository;
import com.agencia.viagens.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Contratos", description = "Gerenciamento de contratos de viagem")
@RestController
@RequestMapping("/contracts")
public class ContractController {

    private final ContractService contractService;
    private final ContractRepository contractRepository;

    public ContractController(ContractService contractService, ContractRepository contractRepository) {
        this.contractService = contractService;
        this.contractRepository = contractRepository;
    }

    @Operation(
            summary = "Criar contrato",
            description = "Cria um contrato de viagem com cliente principal e passageiros adicionais.\n\n" +
                    "Regras:\n" +
                    "- Cliente principal conta como 1 pessoa\n" +
                    "- Total de pessoas = cliente + passageiros\n" +
                    "- Status inicial: PENDING"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contrato criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro nos dados enviados")
    })
    @PostMapping
    public Contract create(@RequestBody ContractRequestDTO dto) {
        return contractService.create(dto);
    }

    @Operation(
            summary = "Listar contratos",
            description = "Retorna todos os contratos cadastrados."
    )
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping
    public List<Contract> list() {
        return contractService.findAll();
    }

    @Operation(
            summary = "Aprovar contrato",
            description = """
                    Aprova um contrato e calcula o valor total.
                    Regra de cálculo:
                    priceTotal = priceBase * totalPeople
                    Após aprovação, o contrato recebe:
                    - Status: APPROVED
                    - Token de acesso"""
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contrato aprovado"),
            @ApiResponse(responseCode = "400", description = "Contrato inválido"),
            @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    })
    @PutMapping("/{id}/approve")
    public ContractResponseDTO approve(@PathVariable UUID id) {
        return contractService.approve(id);
    }

    @Operation(
            summary = "Marcar contrato como pago",
            description = """
                    Define o contrato como pago.
                    Regra:
                    - Só pode ser pago se estiver APPROVED"""
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pagamento registrado"),
            @ApiResponse(responseCode = "400", description = "Contrato não aprovado"),
            @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    })
    @PutMapping("/{id}/pay")
    public Contract pay(@PathVariable UUID id) {
        return contractService.markAsPaid(id);
    }

    @Operation(
            summary = "Confirmar contrato",
            description = """
                    Confirma a viagem após pagamento.
                    Regra:
                    - Só pode confirmar se estiver PAID"""
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contrato confirmado"),
            @ApiResponse(responseCode = "400", description = "Contrato não pago"),
            @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    })
    @PutMapping("/{id}/confirm")
    public Contract confirm(@PathVariable UUID id) {
        return contractService.confirm(id);
    }

    @Operation(
            summary = "Buscar contrato por token",
            description = """
                    Retorna os dados completos do contrato usando o token gerado na aprovação.
                    Ideal para consultas públicas (cliente)."""
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contrato encontrado"),
            @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    })
    @GetMapping("/token/{token}")
    public Contract findByToken(@PathVariable UUID token) {
        return contractService.findByToken(token);
    }
}