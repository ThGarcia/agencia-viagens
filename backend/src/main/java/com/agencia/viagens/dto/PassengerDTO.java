package com.agencia.viagens.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PassengerDTO {

    @Schema(example = "Nome Sobrenome")
    private String name;
    @Schema(example = "XXX.XXX.XXX-XX")
    private String cpf;
    @Schema(example = "X.XXX.XXX")
    private String rg;
    @Schema(example = "dd/mm/aaaa")
    private String birthDate;
    @Schema(example = "Casal, Duplo, Triplo, Quadruplo")
    private String roomType;
}
