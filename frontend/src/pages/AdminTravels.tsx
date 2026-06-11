import { useEffect, useState } from "react";
import type { TravelResponse, TravelRequest } from "../types/travel";
import { getTravels, createTravel, updateTravel, activateTravel, deactivateTravel } from "../services/travelService";

import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { validateDate, validateFullName } from "../utils/validator";
import { capitalizeName, maskDate, maskBRL, parseBRL } from "../utils/masks";

interface TravelFormState extends Omit<Partial<TravelResponse>, 'inclusions' | 'observations'> {
    inclusions: string;
    observations: string;
}

export default function AdminTravels() {
    const [travels, setTravels] = useState<TravelResponse[]>([]);
    const [selected, setSelected] = useState<TravelResponse | null>(null);

    const [form, setForm] = useState<TravelFormState>({
        title: "",
        subtitle: "",
        description: "",
        imageUrl: "",
        departureDate: "",
        returnDate: "",
        year: new Date().getFullYear(),
        priceBase: 0,
        priceDescription: "",
        inclusions: "",
        observations: "",
    });

    const load = () => {
        getTravels().then(setTravels);
    };

    useEffect(() => {
        load();
    }, []);

    const handleToggle = async (t: TravelResponse) => {
        if (t.status === "ACTIVE") {
            await deactivateTravel(t.id);
        } else {
            await activateTravel(t.id);
        }
        load();
    };

    const handleEdit = (t: TravelResponse) => {
        setSelected(t);
        setForm({
            ...t,
            inclusions: t.inclusions.join("\n"),
            observations: t.observations.join("\n"),
        });
    };

    const handleSave = async () => {
        const payload: TravelRequest = {
            title: form.title || "",
            subtitle: form.subtitle || "",
            description: form.description || "",
            imageUrl: form.imageUrl || "",
            departureDate: form.departureDate || "",
            returnDate: form.returnDate || "",
            year: Number(form.year) || 2026,
            priceBase: Number(form.priceBase) || 0,
            priceDescription: form.priceDescription || "",
            inclusions: form.inclusions ? form.inclusions.split("\n") : [],
            observations: form.observations ? form.observations.split("\n") : [],
        };

        if (selected) {
            await updateTravel(selected.id, payload);
        } else {
            await createTravel(payload);
        }

        setSelected(null);
        setForm({
            title: "", subtitle: "", description: "", imageUrl: "",
            departureDate: "", returnDate: "", year: 2026, priceBase: 0,
            priceDescription: "", inclusions: "", observations: ""
        });
        load();
    };

    const active = travels.filter(t => t.status === "ACTIVE");
    const inactive = travels.filter(t => t.status === "INACTIVE");

    return (
        <div style={{ padding: 20 }}>
            <h1>Admin - Viagens</h1>

            <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
                <h2>{selected ? "Editar Viagem" : "Nova Viagem"}</h2>

                <Input 
                    label="Título" 
                    value={form.title || ""}
                    onChange={e => 
                        setForm({ ...form, title: capitalizeName(e.target.value) })
                    } 
                    validator={validateFullName}
                    errorMessage="Digite o destino da viagem"
                />

                <Input 
                    label="Subtítulo" 
                    value={form.subtitle || ""}
                    onChange={e => 
                        setForm({ ...form, subtitle: e.target.value })
                    }
                    validator={validateFullName}
                    errorMessage="Digite uma descrição da imagem"
                />

                <Input 
                    label="Descrição" 
                    value={form.description || ""}
                    onChange={e => 
                        setForm({ ...form, description: e.target.value })
                    }
                    validator={validateFullName}
                    errorMessage="Digite uma descrição da viagem"
                />

                <Input 
                    label="Imagem URL (/images/...)" 
                    value={form.imageUrl || ""}
                    onChange={e => 
                        setForm({ ...form, imageUrl: e.target.value })
                    }
                />

                <Input 
                    label="Data saída" 
                    value={form.departureDate || ""}
                    onChange={e => 
                        setForm({ ...form, departureDate: maskDate(e.target.value) })
                    }
                    validator={validateDate}
                    errorMessage="Digite uma data de saída válida"
                />

                <Input 
                    label="Data retorno" 
                    value={form.returnDate || ""}
                    onChange={e => 
                        setForm({ ...form, returnDate: maskDate(e.target.value) })
                    }
                    validator={validateDate}
                    errorMessage="Digite uma data de retorno válida"
                />

                <Input
                    label="Preço"
                    value={maskBRL(form.priceBase || "")}
                    onChange={e => 
                        setForm({ ...form, priceBase: parseBRL(e.target.value) })
                    } 
                />

                <textarea 
                    placeholder="Inclusões (1 por linha)"
                    value={form.inclusions || ""}
                    onChange={e => 
                        setForm({ ...form, inclusions: e.target.value })
                    } 
                />

                <textarea 
                    placeholder="Observações (1 por linha)"
                    value={form.observations || ""}
                    onChange={e => 
                        setForm({ ...form, observations: e.target.value })
                    } />

                <Button onClick={handleSave} text="Salvar" />
            </div>

            <h2>Ativadas</h2>
            {active.map(t => (
                <div key={t.id} style={{ border: "1px solid green", margin: 5, padding: 10 }}>
                    <strong>Viagem: {t.title}</strong>
                    <p>{t.description}</p>
                    <p>{t.departureDate} - {t.returnDate}</p>
                    <p>Valor: {t.priceBase.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}</p>
                    <Button onClick={() => handleEdit(t)} text="Editar" />
                    <Button onClick={() => handleToggle(t)} text="Desativar" />
                </div>
            ))}

            <h2>Desativadas</h2>
            {inactive.map(t => (
                <div key={t.id} style={{ border: "1px solid red", margin: 5, padding: 10 }}>
                    <strong>Viagem: {t.title}</strong>
                    <p>{t.description}</p>
                    <p>{t.departureDate} - {t.returnDate}</p>
                    <p>Valor: {t.priceBase.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}</p>
                    <Button onClick={() => handleEdit(t)} text="Editar" />
                    <Button onClick={() => handleToggle(t)} text="Ativar" />
                </div>
            ))}
        </div>
    );
}
