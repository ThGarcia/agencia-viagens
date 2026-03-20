package com.agencia.viagens.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponseDTO {
    private UUID id;
    private UUID tokenAccess;
}
