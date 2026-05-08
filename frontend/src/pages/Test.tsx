import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContractByToken, updateContract } from "../services/contractService";
import type { ContractResponse } from "../types/contract";
import "./Test.css";

import Input from "../components/input/Input";

export default function Test() {
    const { token } = useParams();
    const [contract, setContract] = useState<ContractResponse | null>(null);

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
        if (!token) return;

        getContractByToken(token)
            .then((data) => {
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
    }, [token]);

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ margin: 20 }}>Editar Contrato</h1>
            <Input label='Contrato' value={token} />
            <Input label='Viagem' value={contract?.travel.title} />
            <Input label='Data' value={contract?.travel.departureDate} />
            <Input label='Valor' type='number' value={contract?.priceTotal} />
            <Input label='Pagamento' value={contract?.paymentMethod} />

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

            {/*<h2 style={{ margin: 20 }}>Acompanhante</h2>
            <Input label='Nome' value={data.companionName} />
            <Input label='CPF' value={data.companionCpf} />
            <Input label='RG' value={data.companionRg} />
            <Input label='Data de Nascimento' value={data.companionBirthDate} /> */}

            <button
                onClick={async () => {
                    if (!contract?.id) return;

                    try {
                        await updateContract(contract.id, form);
                        alert("Contrato atualizado!");
                    } catch {
                        alert("Erro ao atualizar");
                    }
                }}
            >
                💾 Salvar
            </button>

        </div>
    );
}
