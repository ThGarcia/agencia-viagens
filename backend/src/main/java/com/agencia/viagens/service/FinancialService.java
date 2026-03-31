package com.agencia.viagens.service;

import com.agencia.viagens.model.Contract;
import com.agencia.viagens.model.Payment;
import com.agencia.viagens.model.TravelCost;
import com.agencia.viagens.repository.ContractRepository;
import com.agencia.viagens.repository.PaymentRepository;
import com.agencia.viagens.repository.TravelCostRepository;
import com.agencia.viagens.repository.TravelRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FinancialService {
    private final PaymentRepository paymentRepository;
    private final TravelCostRepository costRepository;
    private final ContractRepository contractRepository;
    private final TravelRepository travelRepository;

    @Transactional
    public Payment addPayment(UUID contractId, BigDecimal amount, String method) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setMethod(method);
        payment.setContract(contract);

        Payment saved = paymentRepository.save(payment);

        BigDecimal totalPaid = contract.getPayments().stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(amount);

        if (totalPaid.compareTo(contract.getPriceTotal()) >= 0) {
            contract.setStatus(com.agencia.viagens.model.ContractStatus.PAID);
            contractRepository.save(contract);
        }

        return saved;
    }

    public Map<String, Object> getTravelReport(UUID travelId) {
        if (!travelRepository.existsById(travelId)) {
            throw new RuntimeException("Viagem não encontrada");
        }

        List<Contract> activeContracts = contractRepository.findByTravelId(travelId).stream()
                .filter(c -> !c.getStatus().name().equals("CANCELLED"))
                .toList();

        BigDecimal totalExpected = activeContracts.stream()
                .map(Contract::getPriceTotal)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalReceived = activeContracts.stream()
                .flatMap(c -> c.getPayments().stream())
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<TravelCost> costs = costRepository.findByTravelId(travelId);

        long confirmedPassengers = activeContracts.stream()
                .filter(c -> c.getStatus().name().equals("CONFIRMED") || c.getStatus().name().equals("PAID"))
                .count();

        BigDecimal totalCosts = costs.stream()
                .map(cost -> {
                    if (cost.isPerPerson()) {
                        return cost.getValue().multiply(BigDecimal.valueOf(confirmedPassengers));
                    }
                    return cost.getValue();
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netProfit = totalExpected.subtract(totalCosts);

        return Map.of(
                "totalExpected", totalExpected,
                "totalReceived", totalReceived,
                "totalRemaining", totalExpected.subtract(totalReceived),
                "totalCosts", totalCosts,
                "netProfit", netProfit,
                "confirmedPassengers", confirmedPassengers
        );
    }
}
