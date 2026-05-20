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
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

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
                    .flatMap(c -> c.getClientPayments().stream())
                    .map(cp -> cp.getPaymentPrice())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                List<TravelCost> costs = costRepository.findByTravelId(travelId);

                long totalPassengers = activeContracts.stream()
                    .mapToLong(Contract::getTotalPeople)
                    .sum();

                long confirmedPassengers = activeContracts.stream()
                    .filter(c -> c.getStatus().name().equals("CONFIRMED")
                            || c.getStatus().name().equals("PAID"))
                    .mapToLong(Contract::getTotalPeople)
                    .sum();

                BigDecimal totalCosts = costs.stream()
                                .map(cost -> {
                                        if (cost.isPerPerson()) {
                                                return cost.getValue()
                                                                .multiply(BigDecimal.valueOf(totalPassengers));
                                        }
                                        return cost.getValue();
                                })
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal projectedProfit = totalExpected.subtract(totalCosts);
                BigDecimal totalRemaining = totalExpected.subtract(totalReceived);
                BigDecimal actualProfit = totalReceived.subtract(totalCosts);
                BigDecimal netProfit = totalReceived.subtract(totalCosts);

                List<Map<String, Object>> clientPayments = activeContracts.stream()
                    .flatMap(c -> c.getClientPayments().stream().map(p -> {
                        Map<String, Object> item = new java.util.HashMap<>();
                        item.put("contractId", c.getId());
                        item.put("clientName", c.getClientName());
                        item.put("amount", p.getPaymentPrice());
                        item.put("method", p.getPaymentType());
                        item.put("date", p.getPaymentDay());
                        return item;
                    }))
                    .toList();

                Map<String, Object> report = new java.util.HashMap<>();

                report.put("totalPassengers", totalPassengers);
                report.put("confirmedPassengers", confirmedPassengers);

                report.put("totalExpected", totalExpected);
                report.put("totalReceived", totalReceived);
                report.put("totalRemaining", totalRemaining);

                report.put("totalCosts", totalCosts);

                report.put("projectedProfit", projectedProfit);
                report.put("actualProfit", actualProfit);
                report.put("totalPayments", totalReceived);

                report.put("costs", costs);
                return report;
        }
}
