package com.agencia.viagens.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contract {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "travel_id")
    private Travel travel;

    private String clientName;
    private String clientCpf;
    private String clientRg;
    private String clientBirthDate;
    private String clientPhone;

    private String addressStreet;
    private String addressNumber;
    private String addressComplement;
    private String addressNeighborhood;
    private String addressCity;
    private String addressState;
    private String addressZip;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Passenger> passengers;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ClientPayment> clientPayments;

    private Integer totalPeople;
    private BigDecimal priceTotal;
    private String paymentMethod;
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private ContractStatus status;

    @Column(unique = true, nullable = false)
    private UUID tokenAccess;

    private String roomType;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL)
    private List<Payment> payments = new ArrayList<>();
}
