import { useEffect, useState } from "react";
import { getContracts } from "../services/contractService";
import { getTravels } from "../services/travelService";
import type { ContractResponse } from "../types/contract";
import type { TravelResponse } from "../types/travel";

export default function AdminContracts() {
    const [contracts, setContracts] = useState<ContractResponse[]>([]);
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [travelFilter, setTravelFilter] = useState("ALL");
    const [travels, setTravels] = useState<TravelResponse[]>([]);

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
                    Pendentes ({countByStatus("PENDING")})
                </button>

                <button onClick={() => setStatusFilter("APPROVED")}>
                    Aprovados ({countByStatus("APPROVED")})
                </button>

                <button onClick={() => setStatusFilter("PAID")}>
                    Pagos ({countByStatus("PAID")})
                </button>

                <button onClick={() => setStatusFilter("CONFIRMED")}>
                    Confirmados ({countByStatus("CONFIRMED")})
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

                            <a href={`/admin/contracts/${c.id}`}>
                                Abrir contrato
                            </a>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
