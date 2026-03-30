import { api } from "./api";
import type { ContractRequest, ContractResponse, PassengerListDTO } from "../types/contract";

const PATH = "/contratos";

export async function createContract(data: ContractRequest) {
  const response = await api.post(`${PATH}`, data);
  
  return {
    id: response.data.id,
    token: response.data.tokenAccess,
  };
}

export async function approveContract(
  id: string,
  data: { priceTotal: number; paymentMethod: string; roomType: string }
) {
  const response = await api.put(`${PATH}/${id}/aprovar`, data);
  return response.data;
}

export async function getContracts(): Promise<ContractResponse[]> {
  const response = await api.get<ContractResponse[]>(PATH);
  return response.data;
}

export async function getContractById(id: string): Promise<ContractResponse> {
  const response = await api.get<ContractResponse>(`${PATH}/${id}`);
  return response.data;
}

export async function getContractByToken(token: string): Promise<ContractResponse> {
  const response = await api.get<ContractResponse>(`${PATH}/token/${token}`); // Sugestão: adicione /token/
  return response.data;
}

export async function getPassengersByTravel(travelId: string): Promise<PassengerListDTO[]> {
  const response = await api.get(`${PATH}/${travelId}/passageiros`);
  return response.data;
}
