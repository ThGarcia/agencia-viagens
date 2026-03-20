package com.agencia.viagens.repository;

import com.agencia.viagens.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ContractRepository extends JpaRepository<Contract, UUID> {
    Optional<Contract> findByTokenAccess(UUID token);}
