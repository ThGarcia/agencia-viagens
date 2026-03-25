package com.agencia.viagens.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelResponseDTO {
    private UUID id;
    private String imageUrl;
    private String title;
    private String subtitle;
    private String slug;
    private String description;
    private String departureDate;
    private String returnDate;
    private Integer year;
    private BigDecimal priceBase;
    private String priceDescription;
    private List<String> inclusions;
    private List<String> observations;
    private String status;
}
