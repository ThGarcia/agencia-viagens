import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTravelById } from "../services/travelService";
import type { TravelResponse } from "../types/travel";

import Loader from "../components/Loader";

export default function TravelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [travel, setTravel] = useState<TravelResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        getTravelById(id)
            .then(setTravel)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Loader />;
    if (!travel) return <p>Viagem não encontrada</p>

    return (
        <div style={{ padding: 20 }}>
            <h1>🚌 {travel.title}</h1>
            <h3>📝 {travel.subtitle}</h3>
            <p>💬 {travel.description}</p>
            <p>💰 {travel.priceBase.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            })}</p>
            <p>📅 Ida: {travel.departureDate}</p>
            <p>📅 Volta: {travel.returnDate}</p>
            <button
                onClick={() => navigate(`/contrato?travelId=${travel.id}`)}
                style={{ marginTop: 20, padding: "10px 20px", cursor: "pointer" }}>
                Contratar
            </button>
        </div>
    );
}
