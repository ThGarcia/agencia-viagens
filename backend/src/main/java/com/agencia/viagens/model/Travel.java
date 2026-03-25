package com.agencia.viagens.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Travel {

    @Id
    @GeneratedValue
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

    @ElementCollection
    private List<String> inclusions;

    @ElementCollection
    private List<String> observations;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TravelStatus status;
}
