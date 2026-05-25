import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getTravelById } from "../services/travelService";
import { createContract } from "../services/contractService";
import type { TravelResponse as Travel } from "../types/travel";
import type { Passenger, ContractRequest } from "../types/contract";

import Loader from "../components/Loader";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { normalizeHouseNumber, validateCPF, validateRG, validateDate, validateFullName, validatePhone, validateCEP, fetchAddressByCEP } from "../utils/validator";
import { capitalizeName, maskCEP, maskCPF, maskRG, maskDate, maskPhone } from "../utils/masks";

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

    const isRequired = (value: string) => value.trim() !== "";

    const isFormValid = () => {
        const requiredFields = [
            form.clientName,
            form.clientCpf,
            form.clientBirthDate,
            form.clientPhone,
            form.addressStreet,
            form.addressComplement,
            form.addressNeighborhood,
            form.addressCity,
            form.addressState,
        ];

        if (requiredFields.some((field) => !isRequired(field))) {
            return false;
        }

        const hasInvalidClientData =
            !validateFullName(form.clientName) ||
            !validateCPF(form.clientCpf) ||
            !validateDate(form.clientBirthDate) ||
            !validatePhone(form.clientPhone);

        if (hasInvalidClientData) {
            return false;
        }

        return passengers.every((passenger) =>
            validateFullName(passenger.name) &&
            validateCPF(passenger.cpf) &&
            validateDate(passenger.birthDate)
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            alert("Preencha todos os campos corretamente antes de enviar.");
            return;
        }

        try {
            const data: ContractRequest = {
                ...form,
                addressNumber: normalizeHouseNumber(form.addressNumber),
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

    const handleZipChange = async (value: string) => {
        const addressZip = maskCEP(value);
        const emptyAddress = {
            addressStreet: "",
            addressNeighborhood: "",
            addressCity: "",
            addressState: "",
        };

        if (!validateCEP(addressZip)) {
            setForm((prev) => ({
                ...prev,
                addressZip,
                ...emptyAddress,
            }));
            return;
        }

        setForm((prev) => ({ ...prev, addressZip }));

        const address = await fetchAddressByCEP(addressZip);

        if (!address) {
            setForm((prev) => {
                if (prev.addressZip !== addressZip) return prev;

                return {
                    ...prev,
                    ...emptyAddress,
                };
            });
            return;
        }

        setForm((prev) => {
            if (prev.addressZip !== addressZip) return prev;

            return {
                ...prev,
                addressStreet: address.street,
                addressNeighborhood: address.neighborhood,
                addressCity: address.city,
                addressState: address.state,
            };
        });
    };

    return (
        <div style={{ padding: 20 }} >
            <h1>Contrato - {travel.title}</h1>

            <h2>Dados de Cliente</h2>

            <Input
                value={form.clientName}
                label="Nome"
                onChange={(e) =>
                    setForm({ ...form, clientName: capitalizeName(e.target.value) })
                }
                validator={validateFullName}
                errorMessage="Digite nome e sobrenome"
            />
            <Input
                value={form.clientCpf}
                label="CPF"
                onChange={(e) =>
                    setForm({ ...form, clientCpf: maskCPF(e.target.value) })
                }
                validator={validateCPF}
                errorMessage="Digite um CPF válido: XXX.XXX.XXX-XX"
            />
            <Input
                value={form.clientRg}
                label="RG"
                onChange={(e) =>
                    setForm({ ...form, clientRg: maskRG(e.target.value) })
                }
                validator={validateRG}
                errorMessage="Digite um RG válido: XX.XXX.XXX-X"
            />
            <Input
                value={form.clientBirthDate}
                label="Data de nascimento"
                onChange={(e) =>
                    setForm({ ...form, clientBirthDate: maskDate(e.target.value) })
                }
                validator={validateDate}
                errorMessage="Escolha uma data valida: dd/mm/aaaa"
            />
            <Input
                value={form.clientPhone}
                label="Telefone"
                onChange={(e) =>
                    setForm({ ...form, clientPhone: maskPhone(e.target.value) })
                }
                validator={validatePhone}
                errorMessage="Digite um telefone válido: (xx) xxxxx-xxxx"
            />

            <h2>Endereço</h2>

            <Input
                value={form.addressStreet}
                label="Rua"
                onChange={(e) =>
                    setForm({ ...form, addressStreet: capitalizeName(e.target.value) })
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
                    setForm({ ...form, addressComplement: capitalizeName(e.target.value) })
                }
            />
            <Input
                value={form.addressNeighborhood}
                label="Bairro"
                onChange={(e) =>
                    setForm({ ...form, addressNeighborhood: capitalizeName(e.target.value) })
                }
            />
            <Input
                value={form.addressCity}
                label="Cidade"
                onChange={(e) =>
                    setForm({ ...form, addressCity: capitalizeName(e.target.value) })
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
                onChange={(e) => handleZipChange(e.target.value)}
                validator={validateCEP}
                errorMessage="Digite um CEP vãlido: xxxxx-xxx"
            />

            <h2>Passageiros</h2>

            {passengers.map((p, i) => (
                <div key={i}>
                    <Input
                        label="Nome"
                        value={p.name}
                        onChange={(e) =>
                            updatePassenger(i, "name", capitalizeName(e.target.value))
                        }
                        validator={validateFullName}
                        errorMessage="Digite nome e sobrenome"
                    />
                    <Input
                        label="CPF"
                        value={p.cpf}
                        onChange={(e) =>
                            updatePassenger(i, "cpf", maskCPF(e.target.value))
                        }
                        validator={validateCPF}
                        errorMessage="Digite um CPF válido: XXX.XXX.XXX-XX"
                    />
                    <Input
                        label="RG"
                        value={p.rg}
                        onChange={(e) =>
                            updatePassenger(i, "rg", maskRG(e.target.value))
                        }
                        validator={validateRG}
                        errorMessage="Digite um RG válido: XX.XXX.XXX-X"
                    />
                    <Input
                        label="Data de nascimento"
                        value={p.birthDate}
                        onChange={(e) =>
                            updatePassenger(i, "birthDate", maskDate(e.target.value))
                        }
                        validator={validateDate}
                        errorMessage=" Escolha uma data valida: dd/mm/aaaa"
                    />
                </div>
            ))}

            <Button onClick={addPassenger} text="+ Adicionar passageiro" />
            <Button onClick={handleSubmit} text="Enviar" />
        </div>
    );
}
