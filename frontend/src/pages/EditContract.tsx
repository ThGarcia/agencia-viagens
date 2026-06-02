import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContractById, updateContract } from "../services/contractService";
import type { ContractResponse, Passenger } from "../types/contract";
import { getTravels } from "../services/travelService";
import type { TravelResponse } from "../types/travel";
import { roomOptions } from "../types/select";
import "./Test.css";

import Input from "../components/input/Input";
import Button from "../components/button/Button";
import SearchInput from "../components/input/InputSearch";
import SelectInput from "../components/input/InputSelect";
import { validateFullName, validateCPF, validatePhone } from "../utils/validator";
import { capitalizeName, maskCPF, maskDate, maskPhone, maskCEP, maskBRL } from "../utils/masks";

export default function Test() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState<ContractResponse | null>(null);
    const [travels, setTravels] = useState<TravelResponse[]>([]);
    const [passengers, setPassengers] = useState<Passenger[]>([]);

    type FormType = {
        clientName: string;
        clientCpf: string;
        clientRg: string;
        clientBirthDate: string;
        clientPhone: string;
        addressStreet: string;
        addressNumber: string;
        addressComplement: string;
        addressNeighborhood: string;
        addressCity: string;
        addressState: string;
        addressZip: string;
    };

    const [form, setForm] = useState<FormType>({
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

    useEffect(() => {
        if (!id) {
            // console.log("ID não encontrado");
            return;
        }

        getContractById(id)
            .then((data) => {
                // console.log("CONTRACT BACKEND 👉", data);
                setContract(data);

                setPassengers(data.passengers || []);

                setForm({
                    clientName: data.clientName || "",
                    clientCpf: data.clientCpf || "",
                    clientRg: data.clientRg || "",
                    clientBirthDate: data.clientBirthDate || "",
                    clientPhone: data.clientPhone || "",
                    addressStreet: data.addressStreet || "",
                    addressNumber: data.addressNumber || "",
                    addressComplement: data.addressComplement || "",
                    addressNeighborhood: data.addressNeighborhood || "",
                    addressCity: data.addressCity || "",
                    addressState: data.addressState || "",
                    addressZip: data.addressZip || "",
                });
            })
            .catch(() => alert("Contrato não encontrado"));
    }, [id]);

    useEffect(() => {
        getTravels().then(setTravels);
    }, []);

    const recalcPrice = (travelPrice: number, totalPeople: number) => {
        return travelPrice * totalPeople;
    };

    const addPassenger = () => {
        setPassengers(prev => {
            const updated = [
                ...prev,
                { name: "", cpf: "", rg: "", birthDate: "" }
            ];

            setContract(c => {
                if (!c) return c;

                const totalPeople = updated.length + 1;

                return {
                    ...c,
                    priceTotal: recalcPrice(c.travel.priceBase, totalPeople)
                };
            });

            return updated;
        });
    };

    const removePassenger = (index: number) => {
        setPassengers(prev => {
            const updated = prev.filter((_, i) => i !== index);

            setContract(c => {
                if (!c) return c;

                const totalPeople = updated.length + 1;

                return {
                    ...c,
                    priceTotal: recalcPrice(c.travel.priceBase, totalPeople)
                };
            });

            return updated;
        });
    };

    const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ margin: 20 }}>Editar Contrato</h1>
            <Input label='Contrato' value={contract?.id} />
            <Input label='Viagem' value={contract?.travel.title} />
            <Input label='Data' value={contract?.travel.departureDate} />
            <Input
                label="Valor"
                type="text"
                value={maskBRL(contract?.priceTotal || 0)}
                onChange={(e) => {

                    const raw = e.target.value
                        .replace(/\D/g, "");

                    const value = Number(raw) / 100;

                    setContract(prev => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            priceTotal: value
                        };
                    });
                }}
            />
            <Input
                label='Pagamento'
                value={contract?.paymentMethod}
                onChange={(e) => {
                    const value = String(e.target.value);

                    setContract(prev => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            paymentMethod: value
                        };
                    });
                }}
            />
            <SelectInput
                label="Quarto"
                value={contract?.roomType || ""}
                options={roomOptions}
                onChange={(value) => {
                    setContract(prev => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            roomType: value
                        };
                    });
                }}
            />
            <SearchInput
                label="Buscar viagem"
                defaultValue={contract?.travel?.title}
                options={travels.map(t => ({
                    id: t.id,
                    title: t.title
                }))}
                onSelect={(selected) => {
                    const fullTravel = travels.find(t => t.id === selected.id);

                    if (!fullTravel) return;

                    setContract(prev => {
                        if (!prev) return prev;

                        const totalPeople = (prev.passengers?.length || 0) + 1;

                        return {
                            ...prev,
                            travel: fullTravel,
                            priceTotal: fullTravel.priceBase * totalPeople
                        };
                    });
                }}
            />

            <h2 style={{ margin: 20 }}>Cliente</h2>
            <Input
                label="Nome"
                value={form.clientName}
                onChange={(e) =>
                    setForm({ ...form, clientName: capitalizeName(e.target.value) })
                }
                validator={validateFullName}
                errorMessage="Digite nome e sobrenome"
            />
            <Input
                label="CPF"
                value={form.clientCpf}
                onChange={(e) =>
                    setForm({ ...form, clientCpf: maskCPF(e.target.value) })
                }
                validator={validateCPF}
            />
            <Input
                label="RG"
                value={form.clientRg}
                onChange={(e) =>
                    setForm({ ...form, clientRg: e.target.value })
                }
            />
            <Input
                label="Data de Nascimento"
                value={form.clientBirthDate}
                onChange={(e) =>
                    setForm({ ...form, clientBirthDate: maskDate(e.target.value) })
                }
            />
            <Input
                label="Telefone"
                value={form.clientPhone}
                onChange={(e) =>
                    setForm({ ...form, clientPhone: maskPhone(e.target.value) })
                }
                validator={validatePhone}
            />

            <h2 style={{ margin: 20 }}>Endereço</h2>
            <Input
                label="Rua"
                value={form.addressStreet}
                onChange={(e) =>
                    setForm({ ...form, addressStreet: e.target.value })
                }
            />
            <Input
                label="Número"
                value={form.addressNumber}
                onChange={(e) =>
                    setForm({ ...form, addressNumber: e.target.value })
                }
            />
            <Input
                label="Complemento"
                value={form.addressComplement}
                onChange={(e) =>
                    setForm({ ...form, addressComplement: e.target.value })
                }
            />
            <Input
                label="Bairro"
                value={form.addressNeighborhood}
                onChange={(e) =>
                    setForm({ ...form, addressNeighborhood: e.target.value })
                }
            />
            <Input
                label="Cidade"
                value={form.addressCity}
                onChange={(e) =>
                    setForm({ ...form, addressCity: e.target.value })
                }
            />
            <Input
                label="Estado"
                value={form.addressState}
                onChange={(e) =>
                    setForm({ ...form, addressState: e.target.value })
                }
            />
            <Input
                label="CEP"
                value={form.addressZip}
                onChange={(e) =>
                    setForm({ ...form, addressZip: maskCEP(e.target.value) })
                }
            />

            <h2 style={{ margin: 20 }}>Passageiros</h2>

            {passengers.map((p, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                    <h4>
                        {passengers.length === 1
                            ? "Acompanhante"
                            : `Acompanhante ${i + 1}`}
                    </h4>

                    <Input
                        label="Nome"
                        value={p.name}
                        onChange={(e) => updatePassenger(i, "name", capitalizeName(e.target.value))}
                        validator={validateFullName}
                        errorMessage="Digite nome e sobrenome"
                    />
                    <Input
                        label="CPF"
                        value={p.cpf}
                        onChange={(e) => updatePassenger(i, "cpf", maskCPF(e.target.value))}
                        validator={validateCPF}
                    />
                    <Input
                        label="RG"
                        value={p.rg}
                        onChange={(e) => updatePassenger(i, "rg", e.target.value)}
                    />
                    <Input
                        label="Data de Nascimento"
                        value={p.birthDate}
                        onChange={(e) => updatePassenger(i, "birthDate", maskDate(e.target.value))}
                    />

                    <Button onClick={() => removePassenger(i)} text="❌ Remover" />
                </div>
            ))}

            <Button onClick={addPassenger} text="+ Adicionar passageiro" />

            <Button
                onClick={async () => {
                    if (!contract?.id) return;

                    if (!validateFullName(form.clientName)) {
                        alert("Informe o nome completo do cliente.");
                        return;
                    }

                    const invalidPassenger = passengers.find((passenger) => !validateFullName(passenger.name));
                    if (invalidPassenger) {
                        alert("Informe o nome completo de todos os passageiros.");
                        return;
                    }

                    try {
                        const payload = {
                            ...form,
                            travelId: contract.travel.id,
                            passengers: passengers,
                            priceTotal: contract.priceTotal,
                            paymentMethod: contract.paymentMethod,
                            roomType: contract.roomType
                        };

                        // console.log("ENVIANDO UPDATE 👉", payload);

                        await updateContract(contract.id, payload);

                        alert("Contrato atualizado!");
                        navigate(-1);
                    } catch (e) {
                        console.error(e);
                        alert("Erro ao atualizar");
                    }
                }}
                text="💾 Salvar" />

        </div >
    );
}
