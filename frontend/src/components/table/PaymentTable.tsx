import { useState } from "react";
import { clientPayment } from "../../services/contractService";
import type { ContractResponse } from "../../types/contract";
import { maskTableCurrency, maskTableDate } from "../../utils/masks";
import "./Table.css";

import Input from "../input/Input";
import Button from "../button/Button";
import DataTable from "./DataTable";

type PaymentProps = {
    contract: ContractResponse;
    reload: () => void;
};

export default function PaymentTable({ contract, reload }: PaymentProps) {
    const [paymentInputs, setPaymentInputs] = useState<Record<string, {
        price: number | null;
        type: string;
    }>>({});

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
    const paymentRows = contract.clientPayments?.map((payment, index) => [
        `R$ ${maskTableCurrency(payment.paymentPrice)}`,
        payment.paymentType,
        maskTableDate(payment.paymentDay),
        `R$ ${maskTableCurrency(contract.priceTotal - contract.clientPayments
            .slice(0, index + 1)
            .reduce((sum, p) => sum + p.paymentPrice, 0)
        )}`,
    ]) || [];

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
                        <Button onClick={handleAddPayment} text="✅ Adicionar pagamento" />
                    </div>
                </div>
            )}

            <DataTable
                columns={["Valor", "Pagamento", "Data", "Restante"]}
                rows={paymentRows}
                emptyMessage="Nenhum pagamento registrado."
            />
        </div>
    );
}
