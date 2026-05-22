import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { TravelResponse } from "../types/travel"

import Button from "../components/button/Button";

export default function AdminFinancialList() {
    const [travels, setTravels] = useState<TravelResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/viagens").then(res => setTravels(res.data));
    }, []);

    const handleClick = (travelId: string) => {
        navigate(`/admin/financeiro/${travelId}`);
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>💰 Controle Financeiro - Selecione a Viagem</h2>
            <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
                {travels.map(t => (
                    <div key={t.id} style={{
                        padding: 15,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <strong>{t.title}</strong>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>{t.departureDate}</p>
                        </div>
                        <Button text="📊 Ver Relatório" onClick={() => handleClick(t.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
