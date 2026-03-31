package com.agencia.viagens.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String method;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    @JsonIgnore
    private Contract contract;
}
