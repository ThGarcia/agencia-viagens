package com.agencia.viagens.repository;

import com.agencia.viagens.model.Travel;
import com.agencia.viagens.model.TravelStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TravelRepository extends JpaRepository<Travel, UUID> {
    List<Travel> findByStatus(TravelStatus status);
}
