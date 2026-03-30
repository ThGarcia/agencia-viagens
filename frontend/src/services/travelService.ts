import { api } from "./api";
import type { TravelRequest, TravelResponse } from "../types/travel";

const PATH = "/viagens";

export const getTravels = async () => {
  const res = await api.get<TravelResponse[]>(PATH);
  return res.data;
};

export const getTravelById = async (id: string) => {
  const res = await api.get<TravelResponse>(`/viagens/${id}`);
  return res.data;
};

export const getActiveTravels = async () => {
  const res = await api.get<TravelResponse[]>(`${PATH}/ativas`);
  return res.data;
};

export const createTravel = async (data: TravelRequest) => {
  const res = await api.post<TravelResponse>(PATH, data);
  return res.data;
};

export const updateTravel = async (id: string, data: TravelRequest) => {
  const res = await api.put<TravelResponse>(`${PATH}/${id}`, data);
  return res.data;
};

export const activateTravel = async (id: string) => {
  await api.patch(`${PATH}/${id}/ativar`);
};

export const deactivateTravel = async (id: string) => {
  await api.patch(`${PATH}/${id}/desativar`);
};
