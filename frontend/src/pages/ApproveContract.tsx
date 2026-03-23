import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { approveContract } from "../services/contractService";
import { type Contract } from "../types/contract";

export default function AdminApproveContract() {
  const { id } = useParams();

  const [contract, setContract] = useState<Contract | null>(null);
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/contracts/${id}`)
      .then(res => res.json())
      .then(data => {
        setContract(data);

        setPrice(data.priceTotal || data.travel.priceBase * data.totalPeople);
      });
  }, [id]);

  const handleApprove = async () => {
    const res = await approveContract(id!, {
      priceTotal: Number(price),
      paymentMethod,
    });

    alert("Contrato aprovado!");
    console.log("TOKEN:", res.tokenAccess);
  };

  if (!contract) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Aprovar Contrato</h1>

      <h2>Cliente</h2>
      <p>{contract.clientName}</p>

      <h2>Passageiros</h2>
      {contract.passengers?.map((p, i) => (
        <p key={p.id ?? `${p.name}-${i}`}>
          {p.name}
        </p>
      ))}

      <h2>Valor</h2>
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <h2>Forma de pagamento</h2>
      <input
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        placeholder="PIX, Cartão..."
      />

      <button onClick={handleApprove}>
        Aprovar contrato
      </button>
    </div>
  );
}
