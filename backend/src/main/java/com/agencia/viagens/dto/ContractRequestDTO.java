package com.agencia.viagens.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ContractRequestDTO {

    private String clientName;
    private String clientCpf;
    private String clientRg;
    private LocalDate clientBirthDate;
    private String clientPhone;

    private String addressStreet;
    private String addressNumber;
    private String addressComplement;
    private String addressNeighborhood;
    private String addressCity;
    private String addressState;
    private String addressZip;

    private UUID travelId;

    private List<PassengerDTO> passengers;
}
