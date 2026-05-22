import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTravels } from "../services/travelService";
import type { TravelResponse } from "../types/travel";

import Button from "../components/button/Button";

export default function AdminRommingList() {
    const [viagens, setViagens] = useState<TravelResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTravels()
            .then(setViagens)
            .catch(err => console.error("Erro ao carregar viagens:", err));
    }, []);

    const handleClick = (travelId: string) => {
        navigate(`/admin/homming/${travelId}`);
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Rooming Lists</h1>
            <div style={{ display: "grid", gap: "10px", marginTop: 20 }}>
                {viagens.map(v => (
                    <div key={v.id} style={{ padding: 15, border: "1px solid #ccc", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <strong>{v.title}</strong> - {v.departureDate} a {v.returnDate}
                        </div>
                            <Button text="Ver passageiros" onClick={() => handleClick(v.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
