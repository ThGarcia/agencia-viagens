import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { approveContract } from "../services/contractService";
import type { ContractResponse } from "../types/contract";
import { getContractById } from "../services/contractService";

import Loader from "../components/Loader";

export default function AdminApprove() {
    const { id } = useParams();

    const [contract, setContract] = useState<ContractResponse | null>(null);
    const [price, setPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        getContractById(id)
            .then(data => {
                setContract(data);
                setPrice(data.priceTotal || 0);
                setPaymentMethod(data.paymentMethod || "");
            })
            .catch((err) => {
                console.error(err);
                alert("Contrato não encontrado no banco de dados.");
            });
    }, [id]);

    if (!contract) return <Loader />;

    const handleApprove = async () => {
        try {
            const res = await approveContract(contract.id, {
                priceTotal: price,
                paymentMethod,
            });
            navigate(`/contrato/${res.tokenAccess}`);
        } catch (error) {
            console.error("Erro na aprovação:", error);
            alert("Erro ao aprovar contrato");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Contrato</h1>

            <h2>{contract.clientName}</h2>
            <p>📍 {contract.travel.title}</p>
            <p>📱 {contract.clientPhone}</p>

            <h3>Passageiros</h3>
            {contract.passengers?.length ? (
                contract.passengers.map((p, i) => (
                    <p key={i}>- {p.name}</p>
                ))
            ) : (
                <p>Nenhum passageiro</p>
            )}

            <h3>Valor</h3>
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
            />

            <h3>Forma de pagamento</h3>
            <input
                placeholder="Ex: PIX, Cartão, Dinheiro..."
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <button onClick={handleApprove}>
                Aprovar contrato
            </button>
        </div>
    );
}
