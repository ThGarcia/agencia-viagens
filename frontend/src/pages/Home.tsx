import { useEffect, useState } from "react";
import { getActiveTravels } from "../services/travelService";
import type { TravelResponse } from "../types/travel";
import "../styles/Pages.css";

import Loader from "../components/Loader";
import CardTravel from "../components/card/CardTravel";

export default function Home() {
  const [travels, setTravels] = useState<TravelResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveTravels()
      .then(setTravels)
      .catch((err) => console.error("Erro ao carregar viagens:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />

  return (
    <div className="home">
      <h1>Viagens disponíveis</h1>

      {travels.length === 0 && <p>Nenhuma viagem disponível no momento.</p>}
      <div className="travels-list">
        {travels.map((travel) => (
          <CardTravel key={travel.id} travel={travel} />
        ))}
      </div>
    </div>
  );
}
