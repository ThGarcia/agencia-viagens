package com.agencia.viagens.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
public class TravelCost {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String description;
    private BigDecimal value;

    private boolean perPerson;

    @ManyToOne
    @JoinColumn(name = "travel_id")
    @JsonIgnore
    private Travel travel;
}
