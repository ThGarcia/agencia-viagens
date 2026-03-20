package com.agencia.viagens.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PassengerDTO {

    private String name;
    private String cpf;
    private String rg;
    private LocalDate birthDate;
    private String roomType;
}
