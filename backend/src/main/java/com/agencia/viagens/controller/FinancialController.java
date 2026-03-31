package com.agencia.viagens.controller;

import com.agencia.viagens.model.Payment;
import com.agencia.viagens.model.TravelCost;
import com.agencia.viagens.repository.TravelCostRepository;
import com.agencia.viagens.repository.TravelRepository;
import com.agencia.viagens.service.FinancialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Tag(name = "Admin - Financeiro", description = "Gestão de entradas (pagamentos) e saídas (custos de viagem)")
@RestController
@RequiredArgsConstructor
@RequestMapping("/financial")
public class FinancialController {

    private final FinancialService financialService;
    private final TravelCostRepository costRepository;
    private final TravelRepository travelRepository;

    @Operation(
            summary = "Registrar pagamento de cliente",
            description = "Adiciona um valor ao histórico de pagamentos de um contrato. Se o total atingir o valor do contrato, o status muda para PAID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pagamento registrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    })
    @PostMapping("/payments/{contractId}")
    public ResponseEntity<Payment> registerPayment(
            @PathVariable UUID contractId,
            @RequestBody Map<String, Object> payload) {

        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String method = payload.getOrDefault("method", "PIX").toString();

        return ResponseEntity.ok(financialService.addPayment(contractId, amount, method));
    }

    @Operation(
            summary = "Adicionar custo à viagem",
            description = "Cadastra uma despesa (ex: Ônibus, Hotel). Pode ser valor fixo ou por pessoa."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Custo adicionado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Viagem não encontrada")
    })
    @PostMapping("/costs/{travelId}")
    public ResponseEntity<TravelCost> addCost(@PathVariable UUID travelId, @RequestBody TravelCost cost) {
        return travelRepository.findById(travelId)
                .map(travel -> {
                    cost.setTravel(travel);
                    return ResponseEntity.ok(costRepository.save(cost));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Gerar relatório financeiro da viagem",
            description = "Retorna o balanço de lucro, total recebido, custos acumulados e valores pendentes."
    )
    @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso")
    @GetMapping("/report/{travelId}")
    public ResponseEntity<Map<String, Object>> getReport(@PathVariable UUID travelId) {
        return ResponseEntity.ok(financialService.getTravelReport(travelId));
    }

    @Operation(
            summary = "Remover custo",
            description = "Exclui um custo específico lançado anteriormente."
    )
    @ApiResponse(responseCode = "200", description = "Custo removido com sucesso")
    @DeleteMapping("/costs/{costId}")
    public ResponseEntity<Void> deleteCost(@PathVariable UUID costId) {
        costRepository.deleteById(costId);
        return ResponseEntity.ok().build();
    }
}
