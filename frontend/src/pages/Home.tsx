import { useEffect, useState } from "react";
import { getTravels, type Travel } from "../services/travelService";

import Spinner from "../components/Spinner";

export default function Home() {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTravels()
    .then(setTravels)
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />

  return (
    <div>
      <h1>Viagens disponíveis</h1>

      {travels.map((travel) => (
        <div key={travel.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h2>{travel.title}</h2>
          <p>{travel.subtitle}</p>
          <p>💰 R$ {travel.priceBase}</p>
          <p>📅 Ida: {travel.departureDate}</p>
          <p>📅 Volta: {travel.returnDate}</p>
        </div>
      ))}
    </div>
  );
 }
