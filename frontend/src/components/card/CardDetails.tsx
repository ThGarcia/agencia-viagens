import { useNavigate } from "react-router-dom";
import type { TravelResponse } from "../../types/travel";
import Button from "../button/Button";
import "./Card.css";

type Props = {
    travel: TravelResponse;
};

export default function CardDetails({ travel }: Props) {
    const navigate = useNavigate();
    const phoneNumber = "11123456789";
    const message = `Quero mais informacoes sobre a viagem para ${travel.title}`;
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="card-details">
            <img
                src={travel.imageUrl}
                alt={travel.title}
            />
            <p className="card-subtitle">{travel.subtitle}</p>
            <h2>{travel.title}</h2>
            <p>De {travel.departureDate} à {travel.returnDate}</p>
            <div className="card-description">
                <p>{travel.slug}</p>
                <p>{travel.description}</p>
                {travel.inclusions?.length > 0 && (
                    <div>
                        <p className="card-list">Incluso: </p>
                        <ul>
                            {travel.inclusions.map((inclusion, index) => (
                                <li key={index}>• {inclusion}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {travel.observations?.length > 0 && (
                    <div>
                        <p className="card-list">Observações: </p>
                        <ul>
                            {travel.observations.map((observation, index) => (
                                <li key={index}>• {observation}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <p className="card-contact">Entre em contato conosco:</p>
                <div className="card-contact-phones">
                    <a href={`tel:${phoneNumber}`}>
                        Telefone
                    </a>
                    <a href={whatsappUrl} target="_blank">
                        WhatsApp
                    </a>
                </div>
                <p className="card-value">
                    {" "}
                    {travel.priceBase.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </p>

                <Button
                    text="Contratar"
                    onClick={() => navigate(`/contrato?travelId=${travel.id}`)}
                />
            </div>

        </div>
    );
}
