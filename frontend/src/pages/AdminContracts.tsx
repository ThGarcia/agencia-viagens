import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContracts, cancelContract, confirmContract, markAsPaid } from "../services/contractService";
import { getTravels } from "../services/travelService";
import type { ContractResponse } from "../types/contract";
import type { TravelResponse } from "../types/travel";
import { maskBRL } from "../utils/masks";

import PaymentTable from "../components/table/PaymentTable";
import Button from "../components/button/Button";
import SelectInput from "../components/input/InputSelect";

export default function AdminContracts() {
    const [contracts, setContracts] = useState<ContractResponse[]>([]);
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [travelFilter, setTravelFilter] = useState("ALL");
    const [travels, setTravels] = useState<TravelResponse[]>([]);
    const navigate = useNavigate();

    const loadData = () => {
        getContracts().then(setContracts);
        getTravels().then(setTravels);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCancel = async (id: string) => {
        if (window.confirm("Tem certeza que deseja CANCELAR este contrato?")) {
            try {
                await cancelContract(id);
                loadData();
                alert("Contrato cancelado com sucesso.");
            } catch (error) {
                console.error(error);
                alert("Erro ao cancelar contrato.");
            }
        }
    };

    const handleConfirm = async (id: string) => {
        try {
            await confirmContract(id);
            loadData();
            alert("Contrato confirmado na viagem!");
        } catch {
            alert("Erro ao confirmar contrato.");
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        try {
            await markAsPaid(id);
            loadData();
            alert("Pagamento registrado!");
        } catch {
            alert("Erro ao registrar pagamento.");
        }
    };

    const handleViewClientContract = (token: string) => {
        window.open(`/contrato/${token}`, "_blank");
    };

    const filtered = contracts
        .filter(c => statusFilter === "" || c.status === statusFilter)
        .filter(c => travelFilter === "ALL" || c.travel.id === travelFilter);

    const grouped = filtered.reduce<Record<string, ContractResponse[]>>((acc, contract) => {
        const key = contract.travel.title;
        if (!acc[key]) acc[key] = [];
        acc[key].push(contract);
        return acc;
    }, {});

    const countByStatus = (status: string) =>
        contracts.filter(c => c.status === status).length;

    return (
        <div style={{ padding: 20 }}>
            <h1>Painel de Contratos</h1>

            <div style={{ marginBottom: 20, display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => setStatusFilter("PENDING")} style={btnStyle(statusFilter === "PENDING", "#e74c3c")}>
                    🔴 Pendentes ({countByStatus("PENDING")})
                </button>
                <button onClick={() => setStatusFilter("APPROVED")} style={btnStyle(statusFilter === "APPROVED", "#f1c40f")}>
                    🟡 Aprovados ({countByStatus("APPROVED")})
                </button>
                <button onClick={() => setStatusFilter("PAID")} style={btnStyle(statusFilter === "PAID", "#3498db")}>
                    🔵 Pagos ({countByStatus("PAID")})
                </button>
                <button onClick={() => setStatusFilter("CONFIRMED")} style={btnStyle(statusFilter === "CONFIRMED", "#2ecc71")}>
                    🟢 Confirmados ({countByStatus("CONFIRMED")})
                </button>
                <button onClick={() => setStatusFilter("")} style={btnStyle(statusFilter === "", "#fefefe")}>
                    ⚪ Contratos ({contracts.length})
                </button>
                <button onClick={() => setStatusFilter("CANCELLED")} style={btnStyle(statusFilter === "CANCELLED", "#7f8c8d")}>
                    ⚫ Cancelados ({countByStatus("CANCELLED")})
                </button>
            </div>

            <SelectInput
                label="Viagem"
                value={travelFilter}
                onChange={setTravelFilter}
                options={[
                    { value: "ALL", label: "Todas as viagens" },
                    ...travels.map((t) => ({
                        value: t.id,
                        label: t.title
                    }))
                ]}
            />

            {Object.keys(grouped).map((travel) => (
                <div key={travel} style={{ marginBottom: 30 }}>
                    <h2>{travel}</h2>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
                        {grouped[travel].map((c) => (
                            <div key={c.id} style={cardStyle}>
                                <h3>{c.clientName}</h3>
                                <p><strong>Status:</strong> {c.status}</p>
                                <p><strong>Total:</strong> {maskBRL(c.priceTotal)}</p>
                                <p><strong>Pagamento:</strong> {c.paymentMethod}</p>

                                {(c.status === "APPROVED" || c.status === "PAID") && (
                                    <PaymentTable contract={c} reload={loadData} />
                                )}

                                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "10px" }}>

                                    {c.status === "PENDING" && (
                                        <Button onClick={() => navigate(`/admin/contratos/${c.id}`)} text="⚙️ Analisar e Aprovar" bgColor="#f1c40f" color="#FFF" />
                                    )}

                                    {c.tokenAccess && (
                                        <Button onClick={() => handleViewClientContract(c.tokenAccess!)} text="👁️ Ver Contrato" bgColor="#34495e" color="#FFF" />
                                    )}

                                    {c.tokenAccess && (
                                        <Button onClick={() => { navigate(`/test/${c.id}`) }} text="✏️ Editar Contrato" bgColor="#9b59b6" color="#FFF" />
                                    )}

                                    {c.status === "APPROVED" && (
                                        <Button onClick={() => handleMarkAsPaid(c.id)} text="💰 Marcar como Pago" bgColor="#3498db" color="#FFF" />
                                    )}

                                    {c.status === "PAID" && (
                                        <Button onClick={() => handleConfirm(c.id)} text="✅ Confirmar Vaga" bgColor="#2ecc71" color="#FFF" />
                                    )}

                                    {c.status !== "CANCELLED" && (
                                        <Button onClick={() => handleCancel(c.id)} text="🗑️ Cancelar" bgColor="#e74c3c" color="#FFF" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Estilos auxiliares
const btnStyle = (active: boolean, color: string) => ({
    backgroundColor: active ? color : "#fff",
    color: active ? "#fff" : "#000",
} as const);

const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#363636fe",
    boxShadow: "2px 2px 5px rgba(0,0,0,0.05)"
};
