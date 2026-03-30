package com.agencia.viagens.service;

import com.agencia.viagens.dto.*;
import com.agencia.viagens.model.Contract;
import com.agencia.viagens.model.ContractStatus;
import com.agencia.viagens.model.Passenger;
import com.agencia.viagens.model.Travel;
import com.agencia.viagens.repository.ContractRepository;
import com.agencia.viagens.repository.TravelRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final TravelRepository travelRepository;
    private final TravelService travelService; // Injetado para usar o toDTO padrão

    public ContractService(ContractRepository contractRepository,
                           TravelRepository travelRepository,
                           TravelService travelService) {
        this.contractRepository = contractRepository;
        this.travelRepository = travelRepository;
        this.travelService = travelService;
    }

    public List<Contract> findAll() {
        return contractRepository.findAll();
    }

    public Contract create(ContractRequestDTO dto) {
        Travel travel = travelRepository.findById(dto.getTravelId())
                .orElseThrow(() -> new RuntimeException("Travel not found"));

        Contract contract = new Contract();
        contract.setClientName(dto.getClientName());
        contract.setClientCpf(dto.getClientCpf());
        contract.setClientRg(dto.getClientRg());
        contract.setClientBirthDate(dto.getClientBirthDate());
        contract.setClientPhone(dto.getClientPhone());

        contract.setAddressStreet(dto.getAddressStreet());
        contract.setAddressNumber(dto.getAddressNumber());
        contract.setAddressComplement(dto.getAddressComplement());
        contract.setAddressNeighborhood(dto.getAddressNeighborhood());
        contract.setAddressCity(dto.getAddressCity());
        contract.setAddressState(dto.getAddressState());
        contract.setAddressZip(dto.getAddressZip());

        contract.setTravel(travel);
        contract.setStatus(ContractStatus.PENDING);
        contract.setCreatedAt(LocalDateTime.now());
        contract.setTokenAccess(UUID.randomUUID());

        if (dto.getPassengers() != null && !dto.getPassengers().isEmpty()) {
            List<Passenger> passengers = dto.getPassengers().stream().map(p -> {
                Passenger passenger = new Passenger();
                passenger.setName(p.getName());
                passenger.setCpf(p.getCpf());
                passenger.setRg(p.getRg());
                passenger.setBirthDate(p.getBirthDate());
                passenger.setRoomType(p.getRoomType());
                passenger.setContract(contract);
                return passenger;
            }).toList();

            contract.setPassengers(passengers);
            contract.setTotalPeople(passengers.size() + 1);
            BigDecimal priceTotal = travel.getPriceBase().multiply(BigDecimal.valueOf(contract.getTotalPeople()));
            contract.setPriceTotal(priceTotal);
        } else {
            contract.setTotalPeople(1);
            contract.setPriceTotal(travel.getPriceBase());
        }

        return contractRepository.save(contract);
    }

    public Contract findByToken(UUID token) {
        return contractRepository.findByTokenAccess(token)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
    }

    public ContractResponseDTO getById(UUID id) {
        Contract c = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        return ContractResponseDTO.builder()
                .id(c.getId())
                .tokenAccess(c.getTokenAccess())
                .clientName(c.getClientName())
                .clientPhone(c.getClientPhone())
                .priceTotal(c.getPriceTotal())
                .paymentMethod(c.getPaymentMethod())
                .status(c.getStatus())
                .travel(travelService.findById(c.getTravel().getId())) // Usa a lógica centralizada do TravelService
                .passengers(c.getPassengers().stream()
                        .map(p -> {
                            PassengerDTO pDto = new PassengerDTO();
                            pDto.setName(p.getName());
                            return pDto;
                        }).toList())
                .build();
    }

    public ContractResponseDTO approve(UUID id, ApproveContractDTO dto) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (!ContractStatus.PENDING.equals(contract.getStatus())) {
            throw new RuntimeException("Contract not in PENDING status");
        }

        if (dto.getPriceTotal() != null) {
            contract.setPriceTotal(dto.getPriceTotal());
        }

        if (dto.getPaymentMethod() == null || dto.getPaymentMethod().isBlank()) {
            throw new RuntimeException("Payment method is required");
        }

        contract.setPaymentMethod(dto.getPaymentMethod());
        contract.setStatus(ContractStatus.APPROVED);
        contractRepository.save(contract);

        return getById(contract.getId()); // Retorna o DTO completo após aprovar
    }

    public Contract markAsPaid(UUID id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        if (!ContractStatus.APPROVED.equals(contract.getStatus())) {
            throw new RuntimeException("Contract not approved");
        }
        contract.setStatus(ContractStatus.PAID);
        return contractRepository.save(contract);
    }

    public Contract confirm(UUID id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        if (!ContractStatus.PAID.equals(contract.getStatus())) {
            throw new RuntimeException("Contract not paid");
        }
        contract.setStatus(ContractStatus.CONFIRMED);
        return contractRepository.save(contract);
    }
}
