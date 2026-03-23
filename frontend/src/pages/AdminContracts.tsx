import { useEffect, useState } from "react";

type Contract = {
  id: string;
  clientName: string;
  status: string;
  travel: {
    title: string;
  };
};

export default function AdminContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetch("http://localhost:8080/contracts")
      .then(res => res.json())
      .then(setContracts);
  }, []);

  const filtered = contracts.filter(c => c.status === filter);

  const grouped = filtered.reduce<Record<string, Contract[]>>((acc, contract) => {
    const key = contract.travel.title;

    if (!acc[key]) acc[key] = [];
    acc[key].push(contract);

    return acc;
  }, {});

  const countByStatus = (status: string) =>
    contracts.filter(c => c.status === status).length;

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel de Contratos</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setFilter("PENDING")}>
          Pendentes ({countByStatus("PENDING")})
        </button>

        <button onClick={() => setFilter("APPROVED")}>
          Aprovados ({countByStatus("APPROVED")})
        </button>

        <button onClick={() => setFilter("PAID")}>
          Pagos ({countByStatus("PAID")})
        </button>

        <button onClick={() => setFilter("CONFIRMED")}>
          Confirmados ({countByStatus("CONFIRMED")})
        </button>
      </div>

      {Object.keys(grouped).map((travel) => (
        <div key={travel} style={{ marginBottom: 20 }}>
          <h2>{travel}</h2>

          {grouped[travel].map((c: Contract) => (
            <div key={c.id} style={{ border: "1px solid #ccc", margin: 5, padding: 10 }}>
              <p>{c.clientName}</p>
              <p>Status: {c.status}</p>

              <a href={`/admin/contrato/${c.id}`}>
                Abrir contrato
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
