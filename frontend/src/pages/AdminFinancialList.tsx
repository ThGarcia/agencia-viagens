import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api"; 

interface Travel {
    id: string;
    title: string;
    startDate: string;
}

export default function AdminFinancialList() {
    const [travels, setTravels] = useState<Travel[]>([]);

    useEffect(() => {
        api.get("/viagens").then(res => setTravels(res.data));
    }, []);

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
                        <Link to={`/admin/financeiro/${t.id}`}>
                            <button style={{ backgroundColor: "#27ae60", color: "white" }}>
                                Ver Relatório 📊
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
