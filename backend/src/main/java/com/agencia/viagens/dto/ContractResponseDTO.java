package com.agencia.viagens.dto;

import com.agencia.viagens.model.ContractStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractResponseDTO {
    private UUID id;
    private UUID tokenAccess;
    private String clientName;
    private String clientPhone;
    private BigDecimal priceTotal;
    private ContractStatus status;
    private TravelDTO travel;
    private List<PassengerDTO> passengers;
}
