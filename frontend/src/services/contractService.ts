const API_URL = "http://localhost:8080";

export type ContractRequest = {
  clientName: string;
  clientCpf: string;
  clientRg: string;
  clientBirthDate: string;
  clientPhone: string;
  travelId: string;
  passengers: {
    name: string;
    cpf: string;
    rg: string;
    birthDate: string;
    roomType: string;
  }[];
};

export type ContractResponse = {
  id: string;
  tokenAccess: string;
};

export type Contract = {
  id: string;
  clientName: string;
  status: string;
  totalPeople: number;
  travel: {
    id: string;
    title: string;
  };
};

export async function createContract(
  data: ContractRequest,
): Promise<{ id: string; token: string }> {
  const response = await fetch(`${API_URL}/contracts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar contrato");
  }
  const json = await response.json();
  return {
    id: json.id,
    token: json.tokenAccess,
  };
}

export async function approveContract(
  id: string,
  data: { priceTotal: number; paymentMethod: string }
) {
  const res = await fetch(`${API_URL}/contracts/${id}/approve`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao aprovar");
  return res.json(); 
}

export async function getContracts(): Promise<Contract[]> {
  const res = await fetch(`${API_URL}/contracts`);
  if (!res.ok) {
    throw new Error("Erro ao buscar contratos");
  }
  return res.json();
}
