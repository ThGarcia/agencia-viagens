package com.agencia.viagens.controller;

import com.agencia.viagens.dto.ContractRequestDTO;
import com.agencia.viagens.dto.PassengerDTO;
import com.agencia.viagens.model.Contract;
import com.agencia.viagens.model.Passenger;
import com.agencia.viagens.model.Travel;
import com.agencia.viagens.repository.ContractRepository;
import com.agencia.viagens.repository.TravelRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/contracts")
public class ContractController {

    private final ContractRepository contractRepository;
    private final TravelRepository travelRepository;

    public ContractController(ContractRepository contractRepository,
                              TravelRepository travelRepository) {
        this.contractRepository = contractRepository;
        this.travelRepository = travelRepository;
    }

    @PostMapping
    public Contract create(@RequestBody ContractRequestDTO dto) {

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

        contract.setStatus("PENDING");
        contract.setPriceTotal(null);
        contract.setTotalPeople(dto.getPassengers() != null ? dto.getPassengers().size() : 0);

        if (dto.getPassengers() != null) {
            List<Passenger> passengers = dto.getPassengers().stream().map(p -> {
                Passenger passenger = new Passenger();
                passenger.setName(p.getName());
                passenger.setCpf(p.getCpf());
                passenger.setRg(p.getRg());
                passenger.setBirthDate(p.getBirthDate());
                passenger.setRoomType(p.getRoomType());
                passenger.setContract(contract);
                return passenger;
            }).collect(Collectors.toList());

            contract.setPassengers(passengers);
        }

        return contractRepository.save(contract);
    }
}