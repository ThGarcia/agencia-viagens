package com.agencia.viagens.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ApproveContractDTO {
    private BigDecimal priceTotal;
    private String paymentMethod;
    private String roomType;
}
