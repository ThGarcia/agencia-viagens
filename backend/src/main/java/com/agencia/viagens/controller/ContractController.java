package com.agencia.viagens.controller;

import com.agencia.viagens.dto.ContractRequestDTO;
import com.agencia.viagens.dto.ContractResponseDTO;
import com.agencia.viagens.model.Contract;
import com.agencia.viagens.repository.ContractRepository;
import com.agencia.viagens.service.ContractService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/contracts")
public class ContractController {

    private final ContractService contractService;
    private final ContractRepository contractRepository;

    public ContractController(ContractService contractService, ContractRepository contractRepository) {
        this.contractService = contractService;
        this.contractRepository = contractRepository;
    }

    @PostMapping
    public Contract create(@RequestBody ContractRequestDTO dto) {
        return contractService.create(dto);
    }

    @PutMapping("/{id}/approve")
    public ContractResponseDTO approve(@PathVariable UUID id) {
        return contractService.approve(id);
    }

    @GetMapping
    public List<Contract> list() {
        return contractService.findAll();
    }

    @PutMapping("/{id}/pay")
    public Contract pay(@PathVariable UUID id) {
        return contractService.markAsPaid(id);
    }

    @PutMapping("/{id}/confirm")
    public Contract confirm(@PathVariable UUID id) {
        return contractService.confirm(id);
    }

    @GetMapping("/token/{token}")
    public Contract findByToken(@PathVariable UUID token) {
        return contractService.findByToken(token);
    }
}
