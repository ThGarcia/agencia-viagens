import { useEffect, useState } from "react";
import type { TravelResponse, TravelRequest } from "../types/travel";
import { getTravels, createTravel, updateTravel, activateTravel, deactivateTravel } from "../services/travelService";

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

                <input placeholder="Título" value={form.title || ""}
                    onChange={e => setForm({ ...form, title: e.target.value })} />

                <input placeholder="Subtítulo" value={form.subtitle || ""}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })} />

                <input placeholder="Descrição" value={form.description || ""}
                    onChange={e => setForm({ ...form, description: e.target.value })} />

                <input placeholder="Imagem URL (/images/...)" value={form.imageUrl || ""}
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })} />

                <input placeholder="Data saída" value={form.departureDate || ""}
                    onChange={e => setForm({ ...form, departureDate: e.target.value })} />

                <input placeholder="Data retorno" value={form.returnDate || ""}
                    onChange={e => setForm({ ...form, returnDate: e.target.value })} />

                <input type="number" placeholder="Preço"
                    value={form.priceBase || 0}
                    onChange={e => setForm({ ...form, priceBase: Number(e.target.value) })} />

                <textarea placeholder="Inclusões (1 por linha)"
                    value={form.inclusions || ""}
                    onChange={e => setForm({ ...form, inclusions: e.target.value })} />

                <textarea placeholder="Observações (1 por linha)"
                    value={form.observations || ""}
                    onChange={e => setForm({ ...form, observations: e.target.value })} />

                <button onClick={handleSave}>
                    Salvar
                </button>
            </div>

            <h2>Ativadas</h2>
            {active.map(t => (
                <div key={t.id} style={{ border: "1px solid green", margin: 5, padding: 10 }}>
                    <strong>{t.title}</strong>
                    <p>{t.subtitle}</p>

                    <button onClick={() => handleEdit(t)}>Editar</button>
                    <button onClick={() => handleToggle(t)}>Desativar</button>
                </div>
            ))}

            <h2>Desativadas</h2>
            {inactive.map(t => (
                <div key={t.id} style={{ border: "1px solid red", margin: 5, padding: 10 }}>
                    <strong>{t.title}</strong>

                    <button onClick={() => handleEdit(t)}>Editar</button>
                    <button onClick={() => handleToggle(t)}>Ativar</button>
                </div>
            ))}
        </div>
    );
}
