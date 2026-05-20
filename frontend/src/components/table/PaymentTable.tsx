import { useEffect, useState } from "react";
import { clientPayment } from "../../services/contractService";
import type { ContractResponse } from "../../types/contract";
import type { TravelResponse } from "../../types/travel";
import { getContracts } from "../../services/contractService";
import { getTravels } from "../../services/travelService";
import "./Table.css";

import Input from "../input/Input";
import Button from "../button/Button";

type PaymentProps = {
    contract: ContractResponse;
    reload: () => void;
};

export default function PaymentTable({ contract, reload }: PaymentProps) {
    const [contracts, setContracts] = useState<ContractResponse[]>([]);
    const [travels, setTravels] = useState<TravelResponse[]>([]);
    const [paymentInputs, setPaymentInputs] = useState<Record<string, {
        price: number | null;
        type: string;
    }>>({});

    const loadData = () => {
        getContracts().then(setContracts);
        getTravels().then(setTravels);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddPayment = async () => {
        const data = paymentInputs[contract.id];

        if (!data || data.price === undefined || !data.type) {
            alert("Preencha valor e forma de pagamento");
            return;
        }

        try {
            const payload = {
                paymentPrice: data.price || 0,
                paymentType: data.type
            };

            await clientPayment(contract.id, payload);

            alert("Pagamento registrado!");

            setPaymentInputs(prev => ({
                ...prev,
                [contract.id]: { price: null, type: "" }
            }));

            reload();
        } catch (e: any) {
            console.error(e);
            alert(e?.response?.data?.message || "Erro ao registrar pagamento");
        }
    };

    const data = paymentInputs[contract.id] || { price: null, type: "" };

    return (
        <div className="table-group">
            {contract.status === "APPROVED" && (
                <div className="table-payment">
                    <div className="table-inputs">
                        <Input
                            type="number"
                            value={data.price ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                const num = Number(value);

                                setPaymentInputs(prev => ({
                                    ...prev,
                                    [contract.id]: {
                                        price: value === "" ? null : Math.max(0, num),
                                        type: prev[contract.id]?.type || ""
                                    }
                                }));
                            }}
                            label="Valor"
                        />

                        <Input
                            type="text"
                            value={data.type}
                            onChange={(e) =>
                                setPaymentInputs(prev => ({
                                    ...prev,
                                    [contract.id]: {
                                        price: prev[contract.id]?.price ?? null,
                                        type: e.target.value
                                    }
                                }))
                            }
                            label="Pagamento"
                        />
                    </div>
                    <div className="table-button">
                        <Button onClick={handleAddPayment} text="✅" />
                    </div>
                </div>
            )}

            <table className="table-data">
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Pagamento</th>
                        <th>Data</th>
                        <th>Restante</th>
                    </tr>
                </thead>
                <tbody>
                    {contract.clientPayments?.map((payment, index) => (
                        <tr key={index}>
                            <td>R$ {payment.paymentPrice?.toFixed(2)}</td>
                            <td>{payment.paymentType}</td>
                            <td>{payment.paymentDay}</td>
                            <td>
                                R$ {(contract.priceTotal - contract.clientPayments
                                    .slice(0, index + 1)
                                    .reduce((sum, p) => sum + p.paymentPrice, 0)
                                ).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}