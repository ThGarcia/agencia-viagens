package com.agencia.viagens.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Dados para criação de contrato")
public class ContractRequestDTO {

    @Schema(example = "Nome Sobrenome")
    private String clientName;
    @Schema(example = "XXX.XXX.XXX-XX")
    private String clientCpf;
    @Schema(example = "X.XXX.XXX")
    private String clientRg;
    @Schema(example = "dd/mm/aaaa")
    private String clientBirthDate;
    @Schema(example = "(XX) XXXXX-XXXX")
    private String clientPhone;

    @Schema(example = "Rua, Avenida, Servidão")
    private String addressStreet;
    @Schema(example = "00")
    private String addressNumber;
    @Schema(example = "Bloco, Apartamento, casa3")
    private String addressComplement;
    @Schema(example = "Bairro")
    private String addressNeighborhood;
    @Schema(example = "Cidade")
    private String addressCity;
    @Schema(example = "Estado")
    private String addressState;
    @Schema(example = "XXXXX-XXX")
    private String addressZip;

    @Schema(example = "R$ 0.000,00")
    private BigDecimal priceTotal;
    @Schema(example = "Pix, Cartão, Dinheiro")
    private String paymentMethod;
    @Schema(example = "Single, Double, Couple")
    private String roomType;

    @Schema(example = "b3f9c2b2-1234-4a12-9c2e-123456789abc")
    private UUID travelId;

    private List<PassengerDTO> passengers;

    private List<ClientPaymentDTO> clientPayments;
}
