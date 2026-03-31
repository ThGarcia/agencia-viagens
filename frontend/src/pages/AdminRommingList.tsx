import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTravels } from "../services/travelService";

interface Travel {
    id: string;
    title: string;
    departureDate: string;
    returnDate: string;
}

export default function AdminRommingList() {
    const [viagens, setViagens] = useState<Travel[]>([]);

    useEffect(() => {
        getTravels()
            .then(setViagens)
            .catch(err => console.error("Erro ao carregar viagens:", err));
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Rooming Lists</h1>
            <div style={{ display: "grid", gap: "10px", marginTop: 20 }}>
                {viagens.map(v => (
                    <div key={v.id} style={{ padding: 15, border: "1px solid #ccc", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <strong>{v.title}</strong> - {v.departureDate} ({v.returnDate})
                        </div>
                        <Link to={`/admin/homming/${v.id}`}>
                            <button style={{ backgroundColor: "#3498db", color: "white", border: "none", padding: "8px 15px", borderRadius: 5, cursor: "pointer" }}>
                                Ver Passageiros
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
