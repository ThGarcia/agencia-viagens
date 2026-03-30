package com.agencia.viagens.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agencia.viagens.dto.ApproveContractDTO;
import com.agencia.viagens.dto.ContractRequestDTO;
import com.agencia.viagens.dto.ContractResponseDTO;
import com.agencia.viagens.model.Contract;
import com.agencia.viagens.service.ContractService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Contratos", description = "Gerenciamento de contratos de viagem")
@RestController
@RequestMapping("/contratos")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @Operation(
            summary = "Criar contrato",
            description = """
                    Cria um contrato de viagem com cliente principal e passageiros adicionais.
                    Regras:
                    - Cliente principal conta como 1 pessoa
                    - Total de pessoas = cliente + passageiros
                    - Status inicial: PENDING"""
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
            summary = "Listar contratos por id",
            description = "Retorna o contrato com o id especifico."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contrato aprovado"),
            @ApiResponse(responseCode = "400", description = "Contrato inválido"),
            @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    })
    @GetMapping("/{id}")
    public ContractResponseDTO getById(@PathVariable UUID id) {
        return contractService.getById(id);
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
    @PutMapping("/{id}/aprovar")
    public ResponseEntity<ContractResponseDTO> approve(
            @PathVariable UUID id,
            @RequestBody ApproveContractDTO dto
    ) {
        return ResponseEntity.ok(contractService.approve(id, dto));
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
    @PutMapping("/{id}/pago")
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
    @PutMapping("/{id}/confirmar")
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
