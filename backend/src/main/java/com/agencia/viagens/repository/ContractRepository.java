package com.agencia.viagens.repository;

import com.agencia.viagens.model.Contract;
import com.agencia.viagens.model.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContractRepository extends JpaRepository<Contract, UUID> {
    Optional<Contract> findByTokenAccess(UUID token);
    List<Contract> findByTravelIdAndStatus(UUID travelId, ContractStatus status);
}
