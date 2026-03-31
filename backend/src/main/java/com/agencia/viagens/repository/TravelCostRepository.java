package com.agencia.viagens.repository;

import com.agencia.viagens.model.TravelCost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TravelCostRepository extends JpaRepository<TravelCost, UUID> {
    List<TravelCost> findByTravelId(UUID travelId);
}
