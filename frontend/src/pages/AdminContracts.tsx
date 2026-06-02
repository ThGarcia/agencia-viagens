import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContracts, cancelContract, confirmContract, markAsPaid } from "../services/contractService";
import { getTravels } from "../services/travelService";
import type { ContractResponse } from "../types/contract";
import type { TravelResponse } from "../types/travel";
import { maskBRL, maskTableCurrency } from "../utils/masks";
import "../styles/Pages.css";

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

    const statusButtons = [
        { value: "PENDING", label: `Pendentes (${countByStatus("PENDING")})`, color: "#e74c3c" },
        { value: "APPROVED", label: `Aprovados (${countByStatus("APPROVED")})`, color: "#f1c40f" },
        { value: "PAID", label: `Pagos (${countByStatus("PAID")})`, color: "#3498db" },
        { value: "CONFIRMED", label: `Confirmados (${countByStatus("CONFIRMED")})`, color: "#2ecc71" },
        { value: "", label: `Contratos (${contracts.length})`, color: "#000" },
        { value: "CANCELLED", label: `Cancelados (${countByStatus("CANCELLED")})`, color: "#7f8c8d" },
    ];

    const payments = (contract: ContractResponse) => {
        const paid =
            contract.clientPayments?.reduce(
                (sum, payment) => sum + payment.paymentPrice,
                0
            ) || 0;

        const remaining = Math.max(contract.priceTotal - paid, 0);

        return {
            paid: maskTableCurrency(paid),
            remaining: maskTableCurrency(remaining),
        };
    };


    return (
        <div style={{ padding: 20 }}>
            <h1>Painel de Contratos</h1>

            <div style={{ marginBottom: 20, display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {statusButtons.map((button) => (
                    <Button
                        key={button.value || "ALL"}
                        onClick={() => setStatusFilter(button.value)}
                        text={button.label}
                        active={statusFilter === button.value}
                        activeColor={button.color}
                        bgColor="#fff"
                        color="#000"
                    />
                ))}
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
                <div key={travel}>
                    <h2>{travel}</h2>

                    <div className="card-contract-list">
                        {grouped[travel].map((contract) => {
                            const whatsapp = `https://wa.me/55${contract.clientPhone}`;
                            const { paid, remaining } = payments(contract);

                            return (
                                <div key={contract.id} className="card-contract">
                                    <div className="card-contract-header">
                                        <h3>{contract.clientName}</h3>
                                        <h3><a href={whatsapp} target="_blank">
                                            <i className="ri-whatsapp-line"></i> {contract.clientPhone}
                                        </a></h3>
                                    </div>
                                    <p><strong>Status:</strong> {contract.status}</p>
                                    <div className="card-contract-header">
                                        <p><strong>Total:</strong> {maskBRL(contract.priceTotal)}</p>
                                        <p><strong>Pago:</strong> R$ {paid}</p>
                                        <p><strong>Falta:</strong> R$ {remaining}</p>
                                    </div>

                                    {(contract.status === "APPROVED" || contract.status === "PAID") && (
                                        <PaymentTable contract={contract} reload={loadData} />
                                    )}

                                    <div className="card-contract-buttons">
                                        {contract.status === "PENDING" && (
                                            <Button onClick={() => navigate(`/admin/contratos/${contract.id}`)} text="Pendente" bgColor="#f1c40f" color="#FFF" />
                                        )}

                                        {contract.tokenAccess && (
                                            <Button onClick={() => handleViewClientContract(contract.tokenAccess!)} text="Ver Contrato" bgColor="#34495e" color="#FFF" />
                                        )}

                                        {contract.tokenAccess && (
                                            <Button onClick={() => { navigate(`/edit/${contract.id}`); }} text="Editar Contrato" bgColor="#9b59b6" color="#FFF" />
                                        )}

                                        {contract.status === "APPROVED" && (
                                            <Button onClick={() => handleMarkAsPaid(contract.id)} text="Marcar Pago" bgColor="#3498db" color="#FFF" />
                                        )}

                                        {contract.status === "PAID" && (
                                            <Button onClick={() => handleConfirm(contract.id)} text="Confirmar Vaga" bgColor="#2ecc71" color="#FFF" />
                                        )}

                                        {contract.status !== "CANCELLED" && (
                                            <Button onClick={() => handleCancel(contract.id)} text="Cancelar" bgColor="#e74c3c" color="#FFF" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
