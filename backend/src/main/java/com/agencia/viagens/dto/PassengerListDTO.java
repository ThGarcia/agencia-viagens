package com.agencia.viagens.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class PassengerListDTO {

    private int number;
    private String name;
    private String cpf;
    private String birthDate;
    private String age;
}
