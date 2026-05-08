package com.agencia.viagens.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ClientPaymentRequestDTO {
    private BigDecimal paymentPrice;
    private String paymentType;
}
