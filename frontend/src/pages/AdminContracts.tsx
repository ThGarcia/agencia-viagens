import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContracts, cancelContract, confirmContract, markAsPaid } from "../services/contractService";
import { getTravels } from "../services/travelService";
import type { ContractResponse } from "../types/contract";
import type { TravelResponse } from "../types/travel";

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
                loadData(); // Recarrega a lista para refletir a mudança
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
        .filter(c => c.status === statusFilter)
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
                <button onClick={() => setStatusFilter("CANCELLED")} style={btnStyle(statusFilter === "CANCELLED", "#7f8c8d")}>
                    ⚫ Cancelados ({countByStatus("CANCELLED")})
                </button>
            </div>

            <select
                value={travelFilter}
                onChange={(e) => setTravelFilter(e.target.value)}
                style={{ marginBottom: 20, padding: "8px", borderRadius: "5px" }}
            >
                <option value="ALL">Todas as viagens</option>
                {travels.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                ))}
            </select>

            {Object.keys(grouped).map((travel) => (
                <div key={travel} style={{ marginBottom: 30 }}>
                    <h2>{travel}</h2>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
                        {grouped[travel].map((c) => (
                            <div key={c.id} style={cardStyle}>
                                <h3>{c.clientName}</h3>
                                <p><strong>Status:</strong> {c.status}</p>
                                <p><strong>Total:</strong> R$ {c.priceTotal?.toFixed(2)}</p>
                                <p><strong>Pagamento:</strong> {c.paymentMethod}</p>

                                {c.status === "APPROVED" && (
                                    <table style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>Valor</th>
                                                <th>Pagamento</th>
                                                <th>Data</th>
                                                <th>Restante</th>
                                            </tr>
                                        </thead>
                                        {/*<tbody>
                                            {c.clientPayment.map((payment, index) => (
                                                <tr key={index}>
                                                    <td>R$ {payment.paymentPrice?.toFixed(2)}</td>
                                                    <td>{payment.paymentType}</td>
                                                    <td>{payment.paymentDay}</td>
                                                    <td>R$ {payment.paymentRemaining?.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>*/}
                                    </table>
                                )}

                                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "10px" }}>

                                    {c.status === "PENDING" && (
                                        <button onClick={() => navigate(`/admin/contratos/${c.id}`)} style={actionBtn("#f1c40f")}>
                                            ⚙️ Analisar e Aprovar
                                        </button>
                                    )}

                                    {c.tokenAccess && (
                                        <button onClick={() => handleViewClientContract(c.tokenAccess!)} style={actionBtn("#34495e")}>
                                            👁️ Ver Contrato
                                        </button>
                                    )}

                                    {c.status === "APPROVED" && (
                                        <button onClick={() => handleMarkAsPaid(c.id)} style={actionBtn("#3498db")}>
                                            💰 Marcar como Pago
                                        </button>
                                    )}

                                    {c.status === "PAID" && (
                                        <button onClick={() => handleConfirm(c.id)} style={actionBtn("#2ecc71")}>
                                            ✅ Confirmar Vaga
                                        </button>
                                    )}

                                    {c.status !== "CANCELLED" && (
                                        <button onClick={() => handleCancel(c.id)} style={actionBtn("#e74c3c")}>
                                            🗑️ Cancelar
                                        </button>
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
    padding: "10px",
    cursor: "pointer",
    backgroundColor: active ? color : "#fff",
    color: active ? "#fff" : "#000",
    border: `1px solid ${color}`,
    borderRadius: "5px",
    fontWeight: active ? "bold" : "normal"
} as const);

const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#363636fe",
    boxShadow: "2px 2px 5px rgba(0,0,0,0.05)"
};

const actionBtn = (color: string) => ({
    backgroundColor: color,
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem"
});

{/* 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContracts } from "../services/contractService";
import { getTravels } from "../services/travelService";
import type { ContractResponse } from "../types/contract";
import type { TravelResponse } from "../types/travel";

export default function AdminContracts() {
    const [contracts, setContracts] = useState<ContractResponse[]>([]);
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [travelFilter, setTravelFilter] = useState("ALL");
    const [travels, setTravels] = useState<TravelResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getContracts().then(setContracts);
        getTravels().then(setTravels);
    }, []);

    const filtered = contracts
        .filter(c => c.status === statusFilter)
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

            <div style={{ marginBottom: 20 }}>
                <button onClick={() => setStatusFilter("PENDING")}>
                    🔴 Pendentes ({countByStatus("PENDING")})
                </button>
                <button onClick={() => setStatusFilter("APPROVED")}>
                    🟡 Aprovados ({countByStatus("APPROVED")})
                </button>
                <button onClick={() => setStatusFilter("PAID")}>
                    🔵 Pagos ({countByStatus("PAID")})
                </button>
                <button onClick={() => setStatusFilter("CONFIRMED")}>
                    🟢 Confirmados ({countByStatus("CONFIRMED")})
                </button>
                <button onClick={() => setStatusFilter("CANCELLED")}>
                    ⚫ Cancelados ({countByStatus("CANCELLED")})
                </button>
            </div>

            <select
                value={travelFilter}
                onChange={(e) => setTravelFilter(e.target.value)}
                style={{ marginBottom: 20 }}
            >
                <option value="ALL">Todas as viagens</option>

                {travels.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.title}
                    </option>
                ))}
            </select>

            {Object.keys(grouped).map((travel) => (
                <div key={travel} style={{ marginBottom: 20 }}>
                    <h2>{travel}</h2>

                    {grouped[travel].map((c) => (
                        <div key={c.id} style={{ border: "1px solid #ccc", margin: 5, padding: 10 }}>
                            <p>{c.clientName}</p>
                            <p>Status: {c.status}</p>

                            <button
                                onClick={() => navigate(`/admin/contratos/${c.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                Abrir contrato
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}    
*/}