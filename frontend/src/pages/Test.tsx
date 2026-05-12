import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContractById, updateContract } from "../services/contractService";
import type { ContractResponse } from "../types/contract";
import { getTravels } from "../services/travelService";
import type { TravelResponse } from "../types/travel";
import "./Test.css";

import Input from "../components/input/Input";
import SearchInput from "../components/input/InputSearch";

export default function Test() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState<ContractResponse | null>(null);
    const [travels, setTravels] = useState<TravelResponse[]>([]);

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
            console.log("ID não encontrado");
            return;
        }

        getContractById(id)
            .then((data) => {
                //console.log("CONTRACT BACKEND 👉", data);
                setContract(data);

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

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ margin: 20 }}>Editar Contrato</h1>
            <Input label='Contrato' value={contract?.id} />
            <Input label='Viagem' value={contract?.travel.title} />
            <Input label='Data' value={contract?.travel.departureDate} />
            <Input
                label='Valor'
                type='number'
                value={contract?.priceTotal}
                onChange={(e) => {
                    const value = Number(e.target.value);

                    setContract(prev => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            priceTotal: value
                        };
                    });
                }}
            />
            <Input label='Pagamento' value={contract?.paymentMethod} />
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
                            travel: fullTravel, // ✅ mantém estrutura correta
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
                    setForm({ ...form, clientName: e.target.value })
                }
            />
            <Input
                label="CPF"
                value={form.clientCpf}
                onChange={(e) =>
                    setForm({ ...form, clientCpf: e.target.value })
                }
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
                    setForm({ ...form, clientBirthDate: e.target.value })
                }
            />
            <Input
                label="Telefone"
                value={form.clientPhone}
                onChange={(e) =>
                    setForm({ ...form, clientPhone: e.target.value })
                }
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
                    setForm({ ...form, addressZip: e.target.value })
                }
            />

            <button
                onClick={async () => {
                    if (!contract?.id) return;

                    try {
                        const payload = {
                            ...form,
                            travelId: contract.travel.id,
                            passengers: contract.passengers || [],
                            priceTotal: contract.priceTotal
                        };

                        //console.log("ENVIANDO UPDATE 👉", payload);

                        await updateContract(contract.id, payload);

                        alert("Contrato atualizado!");
                        navigate(-1);
                    } catch (e) {
                        console.error(e);
                        alert("Erro ao atualizar");
                    }
                }}
            >
                💾 Salvar
            </button>

        </div >
    );
}
