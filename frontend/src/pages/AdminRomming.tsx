import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPassengersByTravel } from "../services/contractService";
import type { PassengerListDTO } from "../types/contract";

import Button from "../components/button/Button";

export default function AdminRomming() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<PassengerListDTO[]>([]);

    useEffect(() => {
        if (!id) return;
        getPassengersByTravel(id)
            .then(setData)
            .catch(err => console.error("Erro na API:", err));
    }, [id]);

    const groupedByRoom = data.reduce<Record<string, PassengerListDTO[]>>((acc, p) => {
        const key = p.roomType || "Não Definido";
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    return (
        <div style={{ padding: 20 }}>
            <h1>Lista de Passageiros</h1>
            <Button onClick={() => window.print()} text="🖨️ Imprimir Lista" />
            <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Quarto</th>
                        <th>Nome</th>
                        <th>D.N.</th>
                        <th>CPF</th>
                        <th>Idade</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(groupedByRoom).length > 0 ? (
                        Object.entries(groupedByRoom).map(([roomName, passengers]) => (
                            passengers.map((p, index) => (
                                <tr key={p.number}>
                                    <td>{p.number}</td>
                                    {index === 0 && (
                                        <td
                                            rowSpan={passengers.length}
                                        >
                                            {roomName}
                                        </td>
                                    )}
                                    <td>{p.name}</td>
                                    <td>{p.birthDate}</td>
                                    <td>{p.cpf}</td>
                                    <td>{p.age}</td>
                                </tr>
                            ))
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                                Nenhum passageiro confirmado para esta viagem.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
