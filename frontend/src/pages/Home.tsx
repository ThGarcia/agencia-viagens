import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveTravels } from "../services/travelService";
import type { TravelResponse } from "../types/travel";

import Loader from "../components/Loader";

export default function Home() {
  const [travels, setTravels] = useState<TravelResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getActiveTravels()
      .then(setTravels)
      .catch((err) => console.error("Erro ao carregar viagens:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />

  return (
    <div>
      <h1>Viagens disponíveis</h1>

      {travels.length === 0 && <p>Nenhuma viagem disponível no momento.</p>}

      {travels.map((travel) => (
        <div key={travel.id} onClick={() => navigate(`/viagem/${travel.id}`)} style={{ border: "1px solid #ccc", margin: 10, padding: 10, cursor: "pointer" }}>
          <h2>🚌 {travel.title}</h2>
          <p>📝 {travel.description}</p>
          <p>📅 Ida: {travel.departureDate}</p>
          <p>📅 Volta: {travel.returnDate}</p>
          <p>💰 {travel.priceBase.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</p>
        </div>
      ))}
    </div>
  );
}
