import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTravels, type Travel } from "../services/travelService";

import Loader from "../components/Loader";

export default function Home() {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTravels()
      .then(setTravels)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />

  return (
    <div>
      <h1>Viagens disponíveis</h1>

      {travels.map((travel) => (
        <div key={travel.id} onClick={() => navigate(`/viagem/${travel.id}`)} style={{ border: "1px solid #ccc", margin: 10, padding: 10, cursor: "pointer" }}>
          <h2>{travel.title}</h2>
          <p>{travel.subtitle}</p>
          <p>💰 R$ {travel.priceBase.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</p>
          <p>📅 Ida: {travel.departureDate}</p>
          <p>📅 Volta: {travel.returnDate}</p>
        </div>
      ))}
    </div>
  );
}
