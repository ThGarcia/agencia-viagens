import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPassengersByTravel } from "../services/contractService";

interface PassengerListDTO {
    number: number;
    name: string;
    cpf: string;
    birthDate: string;
    age: string;
}

export default function AdminHomming() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<PassengerListDTO[]>([]);

    useEffect(() => {
        if (!id) return;
        getPassengersByTravel(id)
            .then(setData)
            .catch(err => console.error("Erro na API:", err));
    }, [id]);

    return (
        <div style={{ padding: 20 }}>
            <h1>Lista de Passageiros</h1>
            <button
                onClick={() => window.print()}
                style={{ marginBottom: 20, padding: "10px 20px", cursor: "pointer", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "5px" }}
            >
                🖨️ Imprimir Lista
            </button>
            <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>D.N.</th>
                        <th>CPF</th>
                        <th>Idade</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length > 0 ? (
                        data.map((p) => (
                            <tr key={p.number}>
                                <td>{p.number}</td>
                                <td>{p.name}</td>
                                <td>{p.birthDate}</td>
                                <td>{p.cpf}</td>
                                <td>{p.age}</td>
                            </tr>
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
