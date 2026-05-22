import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getTravelById } from "../services/travelService";
import { createContract } from "../services/contractService";
import type { TravelResponse as Travel } from "../types/travel";
import type { Passenger, ContractRequest } from "../types/contract";

import Loader from "../components/Loader";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { normalizeHouseNumber, validateCPF, validateDate, validateFullName, validatePhone } from "../utils/validator";
import { maskCEP, maskCPF, maskDate, maskPhone } from "../utils/masks";

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

    const addPassenger = () => {
        setPassengers([
            ...passengers,
            { name: "", cpf: "", rg: "", birthDate: "" },
        ]);
    };

    const handleSubmit = async () => {
        try {
            const data: ContractRequest = {
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

            <Input
                value={form.clientName}
                label="Nome"
                onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                }
                validator={validateFullName}
            />
            <Input
                value={form.clientCpf}
                label="CPF"
                onChange={(e) =>
                    setForm({ ...form, clientCpf: maskCPF(e.target.value) })
                }
                validator={validateCPF}
            />
            <Input
                value={form.clientRg}
                label="RG"
                onChange={(e) =>
                    setForm({ ...form, clientRg: e.target.value })
                }
            />
            <Input
                value={form.clientBirthDate}
                label="data nascimento"
                onChange={(e) =>
                    setForm({ ...form, clientBirthDate: maskDate(e.target.value) })
                }
                validator={validateDate}
            />
            <Input
                value={form.clientPhone}
                label="Telefone"
                onChange={(e) =>
                    setForm({ ...form, clientPhone: maskPhone(e.target.value) })
                }
                validator={validatePhone}
            />

            <h2>Endereço</h2>

            <Input
                value={form.addressStreet}
                label="Rua"
                onChange={(e) =>
                    setForm({ ...form, addressStreet: (e.target.value) })
                }
            />
            <Input
                value={form.addressNumber}
                label="Numero"
                onChange={(e) =>
                    setForm({ ...form, addressNumber: (e.target.value) })
                }
            />
            <Input
                value={form.addressComplement}
                label="Complemento"
                onChange={(e) =>
                    setForm({ ...form, addressComplement: (e.target.value) })
                }
            />
            <Input
                value={form.addressNeighborhood}
                label="Bairro"
                onChange={(e) =>
                    setForm({ ...form, addressNeighborhood: (e.target.value) })
                }
            />
            <Input
                value={form.addressCity}
                label="Cidade"
                onChange={(e) =>
                    setForm({ ...form, addressCity: (e.target.value) })
                }
            />
            <Input
                value={form.addressState}
                label="Estado"
                onChange={(e) =>
                    setForm({ ...form, addressState: (e.target.value) })
                }
            />
            <Input
                value={form.addressZip}
                label="CEP"
                onChange={(e) =>
                    setForm({ ...form, addressZip: maskCEP(e.target.value) })
                }
            />

            <h2>Passageiros</h2>

            {passengers.map((_, i) => (
                <div key={i}>
                    <Input label="Nome" onChange={(e) => updatePassenger(i, "name", e.target.value)} />
                    <Input label="CPF" onChange={(e) => updatePassenger(i, "cpf", maskCPF(e.target.value))} />
                    <Input label="RG" onChange={(e) => updatePassenger(i, "rg", e.target.value)} />
                    <Input label="data nascimento" onChange={(e) => updatePassenger(i, "birthDate", maskDate(e.target.value))} />
                </div>
            ))}

            <Button onClick={addPassenger} text="+ Adicionar passageiro" />
            <Button onClick={handleSubmit} text="Enviar" />
        </div>
    );
}
