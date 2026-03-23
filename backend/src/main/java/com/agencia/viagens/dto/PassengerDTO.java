package com.agencia.viagens.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    public PassengerDTO(String name) {
        this.name = name;
    }
}
