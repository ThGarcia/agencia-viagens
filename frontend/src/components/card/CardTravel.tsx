import { useNavigate } from "react-router-dom";
import type { TravelResponse } from "../../types/travel";
import Button from "../button/Button";
import "./Card.css";

type Props = {
  travel: TravelResponse;
};

export default function CardTravel({ travel }: Props) {
  const navigate = useNavigate();

  return (
    <div className="card-group">
      <img
        src={travel.imageUrl}
        alt={travel.title}
      />

      <div className="card-text">
        <div>
          <h2 className="card-trip">🚌 {travel.title}</h2>
          <p className="card-trip">📝 {travel.description}</p>
          <p>📅 Ida: {travel.departureDate}</p>
          <p>📅 Volta: {travel.returnDate}</p>
          <p>
            💰{" "}
            {travel.priceBase.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <Button
          text="Ver detalhes"
          onClick={() => navigate(`/viagem/${travel.id}`)}
        />
      </div>
    </div>
  );
}