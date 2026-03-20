package com.agencia.viagens.repository;

import com.agencia.viagens.model.Travel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TravelRepository extends JpaRepository<Travel, UUID> {
    List<Travel> findByStatus(String status);
}
