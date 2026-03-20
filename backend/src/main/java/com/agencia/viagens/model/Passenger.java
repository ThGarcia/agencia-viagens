package com.agencia.viagens.model;

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
    private Contract contract;

    private String name;
    private String cpf;
    private String rg;
    private LocalDate birthDate;
    private String roomType;
}
