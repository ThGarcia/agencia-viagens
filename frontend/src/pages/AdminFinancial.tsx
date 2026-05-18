import { useEffect, useState, useCallback } from "react";
import { data, useParams } from "react-router-dom";
import { getFinancialReport, addTravelCost, deleteTravelCost } from "../services/financialService";
import type { FinancialReport, TravelCost } from "../types/financial";

export default function AdminFinancial() {
    const { travelId } = useParams<{ travelId: string }>();
    const [report, setReport] = useState<FinancialReport | null>(null);
    const [costs, setCosts] = useState<TravelCost[]>([]); 
    const [newCost, setNewCost] = useState<TravelCost>({ description: "", value: 0, perPerson: false });

    const loadData = useCallback(async () => {
        if (!travelId) return;
        try {
            const data = await getFinancialReport(travelId);
            setReport(data);
            setCosts(data.costs || []); 
            console.log(data)
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

    return (
        <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
            <h2>📊 Financeiro da Viagem</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 30 }}>
                <Card title="Receita Total (Projetada)" value={report.totalExpected} color="#2ecc71" />
                <Card title="Já Recebido" value={report.totalReceived} color="#3498db" />
                <Card title="Falta Receber" value={report.totalRemaining} color="#e67e22" />
                <Card title="Custos Totais" value={report.totalCosts} color="#e74c3c" />
                <Card title="Lucro Estimado" value={report.projectedProfit} color="#9b59b6" />
            </div>

            <hr />

            <div style={{ padding: 20, borderRadius: 8, marginTop: 20, marginBottom: 20 }}>
                <h3>➕ Lançar Custo (Saída)</h3>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input 
                        placeholder="Ex: Ônibus, Hotel..." 
                        value={newCost.description}
                        onChange={e => setNewCost({...newCost, description: e.target.value})}
                    />
                    <input 
                        type="number" 
                        placeholder="Valor R$" 
                        value={newCost.value || ""}
                        onChange={e => setNewCost({...newCost, value: Number(e.target.value)})}
                    />
                    <label>
                        <input 
                            type="checkbox" 
                            checked={newCost.perPerson}
                            onChange={e => setNewCost({...newCost, perPerson: e.target.checked})}
                        /> Por pessoa?
                    </label>
                    <button onClick={handleAddCost} style={{ backgroundColor: "#2c3e50", color: "white" }}>Salvar Custo</button>
                </div>
            </div>

            <h3>💸 Detalhamento de Custos</h3>
            <table border={1} style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th style={{ padding: 10 }}>Descrição</th>
                        <th>Tipo</th>
                        <th>Valor Unitário</th>
                        <th>Total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {costs.map((c) => (
                        <tr key={c.id}>
                            <td style={{ padding: 10 }}>{c.description}</td>
                            <td>{c.perPerson ? "Por Pessoa" : "Fixo"}</td>
                            <td>R$ {c.value.toFixed(2)}</td>
                            <td>R$ {c.perPerson ? (c.value * report.totalPassengers).toFixed(2) : c.value.toFixed(2)}</td>
                            <td>
                                <button onClick={() => c.id && handleDelete(c.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>🗑️ Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Card({ title, value, color }: { title: string, value: number, color: string }) {
    return (
        <div style={{ border: `2px solid ${color}`, padding: 15, borderRadius: 10, textAlign: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#666" }}>{title}</span>
            <h3 style={{ margin: "5px 0", color: color }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            </h3>
        </div>
    );
}
