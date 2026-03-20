package com.agencia.viagens.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private String title;
    private String slug;
    private String description;
    private String subtitle;
    private LocalDate departureDate;
    private LocalDate returnDate;
    private Integer year;
    private BigDecimal priceBase;
    private String priceDescription;
    private String observation;
    private String status;
}
