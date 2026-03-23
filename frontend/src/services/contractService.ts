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
  data: { priceTotal?: number; paymentMethod?: string } = { paymentMethod: "" }
) {
  const res = await fetch(`${API_URL}/contracts/${id}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
