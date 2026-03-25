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

    public ContractService(ContractRepository contractRepository,
                           TravelRepository travelRepository) {
        this.contractRepository = contractRepository;
        this.travelRepository = travelRepository;
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

        int totalPeople = 1;
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
            totalPeople += passengers.size();
        }
        contract.setTotalPeople(totalPeople);
        BigDecimal priceTotal = travel.getPriceBase()
                .multiply(BigDecimal.valueOf(totalPeople));
        contract.setPriceTotal(priceTotal);
        return contractRepository.save(contract);
    }

    public Contract findByToken(UUID token) {
        return contractRepository.findByTokenAccess(token)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
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

        return ContractResponseDTO.builder()
                .id(contract.getId())
                .tokenAccess(contract.getTokenAccess())
                .status(contract.getStatus())
                .build();
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

    public ContractResponseDTO getById(UUID id) {
        Contract c = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        Travel t = c.getTravel();
        ContractResponseDTO dto = new ContractResponseDTO();

        dto.setId(c.getId());
        dto.setTokenAccess(c.getTokenAccess());
        dto.setClientName(c.getClientName());
        dto.setClientPhone(c.getClientPhone());
        dto.setPriceTotal(c.getPriceTotal());
        dto.setStatus(c.getStatus());

        dto.setTravel(new TravelDTO(
                t.getId(),
                t.getTitle(),
                t.getSubtitle(),
                t.getDescription(),
                t.getSlug(),
                t.getImageUrl(),
                t.getYear(),
                t.getDepartureDate(),
                t.getReturnDate(),
                t.getInclusions(),
                t.getObservations(),
                t.getPriceBase(),
                t.getPriceDescription(),
                t.getStatus().toString()
        ));

        List<PassengerDTO> passengers = c.getPassengers().stream()
                .map(p -> {
                    PassengerDTO pDto = new PassengerDTO();
                    pDto.setName(p.getName());
                    return pDto;
                })
                .toList();
        dto.setPassengers(passengers);
        return dto;
    }
}
