import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTravelById, type Travel } from "../services/travelService";

import Loader from "../components/Loader";

type Passenger = {
    name: string;
    cpf: string;
    rg: string;
    birthDate: string;
    roomType: string;
}

export default function CreateContract () {
    const [params] = useSearchParams();
    const travelId = params.get("travelId");

    const [travel, setTravel] = useState<Travel | null>(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        clientName: "",
        clientCpf: "",
        clientRg: "",
        clientBirthDate: "",
        ClientPhone: "",
    });

    const [passengers, setPassengers] = useState<Passenger[]>([]);

    useEffect(() => {
        if (!travelId) return;

        getTravelById(travelId)
        .then(setTravel)
        .finally(() => setLoading(false));
    }, [travelId]);

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

    const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    return (
        <div style={{ padding: 20}} >
            <h1>Contrato - {travel.title}</h1>

            <h2>Dados de Cliente</h2>

            <input name="clientName" placeholder="Nome" onChange={handleChange} />
            <input name="clientCpf" placeholder="CPF" onChange={handleChange} />
            <input name="clientRg" placeholder="RG" onChange={handleChange} />
            <input name="clientBirthDate" placeholder="data nascimento" onChange={handleChange} />
            <input name="clientPhone" placeholder="Telefone" onChange={handleChange} />

            <h2>Passageiros</h2>

            {passengers.map((p, i) => (
                <div key={i}>
                    <input placeholder="Nome" onChange={(e) => updatePassenger(i, "name", e.target.value)} />
                    <input placeholder="CPF" onChange={(e) => updatePassenger(i, "cpf", e.target.value)} />
                    <input placeholder="RG" onChange={(e) => updatePassenger(i, "rg", e.target.value)} />
                    <input placeholder="data nascimento" onChange={(e) => updatePassenger(i, "birthDate", e.target.value)} />
                    <input placeholder="Quarto" onChange={(e) => updatePassenger(i, "roomType", e.target.value)} />
                </div>
            ))}

            <button onClick={addPassenger}>+ Adicionar passageiro</button>
            <br/><br/>
            <button onClick={() => console.log({ ...form, passengers, travelId })}>
                Enviar
            </button>
        </div>
    );
}
