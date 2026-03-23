package com.agencia.viagens.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Passenger {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    @JsonBackReference
    private Contract contract;

    private String name;
    private String cpf;
    private String rg;
    private String birthDate;
    private String roomType;
}
