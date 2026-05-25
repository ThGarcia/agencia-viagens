import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPassengersByTravel } from "../services/contractService";
import type { PassengerListDTO } from "../types/contract";
import { maskTableDate } from "../utils/masks";

import Button from "../components/button/Button";
import DataTable from "../components/table/DataTable";

export default function AdminRomming() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<PassengerListDTO[]>([]);

    useEffect(() => {
        if (!id) return;

        getPassengersByTravel(id)
            .then(setData)
            .catch((err) => console.error("Erro na API:", err));
    }, [id]);

    const groupedByRoom = data.reduce<Record<string, PassengerListDTO[]>>((acc, passenger) => {
        const key = passenger.roomType || "Nao Definido";
        if (!acc[key]) acc[key] = [];
        acc[key].push(passenger);
        return acc;
    }, {});

    const passengerRows = Object.entries(groupedByRoom).flatMap(([roomName, passengers]) =>
        passengers.map((passenger, index) => [
            passenger.number,
            index === 0 ? { content: roomName, rowSpan: passengers.length } : null,
            passenger.name,
            maskTableDate(passenger.birthDate),
            passenger.cpf,
            passenger.age,
        ])
    );

    return (
        <div style={{ padding: 20 }}>
            <h1>Lista de Passageiros</h1>
            <Button onClick={() => window.print()} text="Imprimir Lista" />
            <DataTable
                columns={["#", "Quarto", "Nome", "D.N.", "CPF", "Idade"]}
                rows={passengerRows}
                emptyMessage="Nenhum passageiro confirmado para esta viagem."
            />
        </div>
    );
}
