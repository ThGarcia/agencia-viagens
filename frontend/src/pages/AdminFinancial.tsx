import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getFinancialReport, addTravelCost, deleteTravelCost } from "../services/financialService";
import type { FinancialReport, TravelCost } from "../types/financial";
import { getContracts } from "../services/contractService";
import type { ContractResponse } from "../types/contract";

import Input from "../components/input/Input";
import Button from "../components/button/Button";
import DataTable from "../components/table/DataTable";
import { maskTableCurrency } from "../utils/masks";

export default function AdminFinancial() {
    const { travelId } = useParams<{ travelId: string }>();
    const [report, setReport] = useState<FinancialReport | null>(null);
    const [costs, setCosts] = useState<TravelCost[]>([]);
    const [contracts, setContracts] = useState<ContractResponse[]>([]);
    const [newCost, setNewCost] = useState<TravelCost>({ description: "", value: 0, perPerson: false });

    const loadData = useCallback(async () => {
        if (!travelId) return;

        try {
            const data = await getFinancialReport(travelId);
            const contractData = await getContracts();

            setReport(data);
            setCosts(data.costs || []);
            setContracts(contractData.filter((contract) =>
                contract.travel?.id === travelId &&
                contract.status !== "CANCELLED"
            ));
            console.log(data);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }, [travelId]);

    useEffect(() => {
        const fetch = async () => { await loadData(); };
        fetch();
    }, [loadData]);

    const handleAddCost = async () => {
        if (!travelId || !newCost.description || newCost.value <= 0) return;

        await addTravelCost(travelId, newCost);
        setNewCost({ description: "", value: 0, perPerson: false });
        loadData();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Remover este custo?")) {
            await deleteTravelCost(id);
            loadData();
        }
    };

    if (!report) return <p>Carregando dados financeiros...</p>;

    const costRows = costs.map((cost) => [
        cost.description,
        cost.perPerson ? "Por Pessoa" : "Fixo",
        `R$ ${maskTableCurrency(cost.value)}`,
        `R$ ${maskTableCurrency(cost.perPerson ? cost.value * report.totalPassengers : cost.value)}`,
        <Button onClick={() => cost.id && handleDelete(cost.id)} text={<i className="ri-delete-bin-5-line"> Excluir</i>} bgColor="transparent" color="red" />,
    ]);

    const contractPaymentRows = contracts.map((contract) => {
        const paid = contract.clientPayments?.reduce((sum, payment) => sum + payment.paymentPrice, 0) || 0;
        const remaining = Math.max(contract.priceTotal - paid, 0);

        return [
            contract.clientName,
            contract.passengers.length + 1,
            contract.roomType || "Nao definido",
            `R$ ${maskTableCurrency(paid)}`,
            `R$ ${maskTableCurrency(remaining)}`,
        ];
    });

    return (
        <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
            <h2>Financeiro da Viagem</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 30 }}>
                <Card title="Receita Total (Projetada)" value={report.totalExpected} color="#2ecc71" />
                <Card title="Ja Recebido" value={report.totalReceived} color="#3498db" />
                <Card title="Falta Receber" value={report.totalRemaining} color="#e67e22" />
                <Card title="Custos Totais" value={report.totalCosts} color="#e74c3c" />
                <Card title="Lucro Estimado" value={report.projectedProfit} color="#9b59b6" />
            </div>

            <hr />

            <div style={{ padding: 20, borderRadius: 8, marginTop: 20, marginBottom: 20 }}>
                <h3>Lançar Custo (Saida)</h3>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Input
                        label="Ex: Onibus, Hotel..."
                        value={newCost.description}
                        onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
                    />
                    <Input
                        type="number"
                        label="Valor R$"
                        value={newCost.value || ""}
                        onChange={(e) => setNewCost({ ...newCost, value: Number(e.target.value) })}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={newCost.perPerson}
                            onChange={(e) => setNewCost({ ...newCost, perPerson: e.target.checked })}
                        /> Por pessoa?
                    </label>
                    <Button onClick={handleAddCost} text="Salvar" />
                </div>
            </div>

            <h3>Detalhamento de Custos</h3>
            <div style={{ marginTop: 20 }}>
                <DataTable
                    columns={["Descrição", "Tipo", "Valor Unitário", "Total", "Ações"]}
                    rows={costRows}
                    emptyMessage="Nenhum custo registrado."
                />
            </div>

            <h3 style={{ marginTop: 30 }}>Pagamentos por Contrato</h3>
            <div style={{ marginTop: 20 }}>
                <DataTable
                    columns={["Nome", "Pessoas", "Quarto", "Pago", "Restante"]}
                    rows={contractPaymentRows}
                    emptyMessage="Nenhum contrato encontrado para esta viagem."
                />
            </div>
        </div>
    );
}

function Card({ title, value, color }: { title: string, value: number, color: string }) {
    return (
        <div style={{ border: `2px solid ${color}`, padding: 15, borderRadius: 10, textAlign: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#666" }}>{title}</span>
            <h3 style={{ margin: "5px 0", color }}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
            </h3>
        </div>
    );
}
