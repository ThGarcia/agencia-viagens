import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { approveContract } from "../services/contractService";
import type { ContractResponse } from "../types/contract";

import Loader from "../components/Loader";

export default function AdminApprove() {
    const { id } = useParams();

    const [contract, setContract] = useState<ContractResponse | null>(null);
    const [price, setPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/contratos/${id}`)
            .then(res => res.json())
            .then(data => {
                setContract(data);
                setPrice(data.priceTotal || 0);
            });
    }, [id]);

    if (!contract) return <Loader />;

    const handleApprove = async () => {
        const res = await approveContract(contract.id, {
            priceTotal: price,
            paymentMethod,
        });
        setContract({ ...contract, status: "APPROVED" });
        const link = `http://localhost:5173/contrato/${res.tokenAccess}`;
        const phone = contract.clientPhone.replace(/\D/g, "");
        const message = encodeURIComponent(
            `Olá ${contract.clientName}!\n\nSeu contrato da viagem *${contract.travel.title}* foi aprovado!\n\nAcesse aqui:\n${link}`
        );
        window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Contrato</h1>

            <h2>{contract.clientName}</h2>
            <p>📍 {contract?.travel?.title}</p>
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
                Aprovar e enviar WhatsApp
            </button>
        </div>
    );
}
