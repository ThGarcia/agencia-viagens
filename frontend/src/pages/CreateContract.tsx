import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getTravelById } from "../services/travelService";
import type { TravelResponse as Travel } from "../services/travelService";
import { createContract } from "../services/contractService";

import Loader from "../components/Loader";

type Passenger = {
    name: string;
    cpf: string;
    rg: string;
    birthDate: string;
    roomType: string;
}

export default function CreateContract() {
    const [params] = useSearchParams();
    const travelId = params.get("travelId");
    const navigate = useNavigate();

    const [travel, setTravel] = useState<Travel | null>(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        clientName: "",
        clientCpf: "",
        clientRg: "",
        clientBirthDate: "",
        clientPhone: "",
        addressStreet: "",
        addressNumber: "",
        addressComplement: "",
        addressNeighborhood: "",
        addressCity: "",
        addressState: "",
        addressZip: "",
    });

    const [passengers, setPassengers] = useState<Passenger[]>([]);

    useEffect(() => {
        if (!travelId) return;

        getTravelById(travelId)
            .then(setTravel)
            .finally(() => setLoading(false));
    }, [travelId]);

    if (!travelId) {
        alert("Viagem inválida");
        return;
    }
    if (loading) return <Loader />;
    if (!travel) return <p>Viagem não encontrada</p>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addPassenger = () => {
        setPassengers([
            ...passengers,
            { name: "", cpf: "", rg: "", birthDate: "", roomType: "" },
        ]);
    };

    const handleSubmit = async () => {
        try {
            const data = {
                ...form,
                travelId: travelId,
                passengers,
            };
            await createContract(data);
            navigate(`/obrigado`);
        } catch (error) {
            console.error(error);
            alert("Erro ao criar contrato");
        }
    };

    const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    return (
        <div style={{ padding: 20 }} >
            <h1>Contrato - {travel.title}</h1>

            <h2>Dados de Cliente</h2>

            <input name="clientName" placeholder="Nome" onChange={handleChange} />
            <input name="clientCpf" placeholder="CPF" onChange={handleChange} />
            <input name="clientRg" placeholder="RG" onChange={handleChange} />
            <input name="clientBirthDate" placeholder="data nascimento" onChange={handleChange} />
            <input name="clientPhone" placeholder="Telefone" onChange={handleChange} />

            <h2>Endereço</h2>

            <input name="addressStreet" placeholder="Rua" onChange={handleChange} />
            <input name="addressNumber" placeholder="Numero" onChange={handleChange} />
            <input name="addressComplement" placeholder="Complemento" onChange={handleChange} />
            <input name="addressNeighborhood" placeholder="Bairro" onChange={handleChange} />
            <input name="addressCity" placeholder="Cidade" onChange={handleChange} />
            <input name="addressState" placeholder="Estado" onChange={handleChange} />
            <input name="addressZip" placeholder="CEP" onChange={handleChange} />

            <h2>Passageiros</h2>

            {passengers.map((_, i) => (
                <div key={i}>
                    <input placeholder="Nome" onChange={(e) => updatePassenger(i, "name", e.target.value)} />
                    <input placeholder="CPF" onChange={(e) => updatePassenger(i, "cpf", e.target.value)} />
                    <input placeholder="RG" onChange={(e) => updatePassenger(i, "rg", e.target.value)} />
                    <input placeholder="data nascimento" onChange={(e) => updatePassenger(i, "birthDate", e.target.value)} />
                    <input placeholder="Quarto" onChange={(e) => updatePassenger(i, "roomType", e.target.value)} />
                </div>
            ))}

            <button onClick={addPassenger}>+ Adicionar passageiro</button>
            <br /><br />
            <button onClick={handleSubmit}>
                Enviar
            </button>
        </div>
    );
}
