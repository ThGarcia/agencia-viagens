package com.agencia.viagens.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class TravelRequestDTO {
    private String imageUrl;
    private String title;
    private String slug;
    private String description;
    private String subtitle;
    private String departureDate;
    private String returnDate;
    private Integer year;

    private BigDecimal priceBase;
    private String priceDescription;

    private List<String> inclusions;
    private List<String> observations;
}
