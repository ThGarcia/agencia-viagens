package com.agencia.viagens.dto;

import com.agencia.viagens.model.TravelStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TravelResponseDTO {
    private UUID id;
    private String title;
    private String subtitle;
    private String slug;
    private String imageUrl;

    private String departureDate;
    private String returnDate;

    private BigDecimal priceBase;
    private List<String> inclusions;
    private List<String> observations;
    private TravelStatus Status;

    public TravelResponseDTO(UUID id, String title, String departureDate, String returnDate, BigDecimal priceBase, String imageUrl, List<String> inclusions, List<String> observations, String name) {
    }
}
