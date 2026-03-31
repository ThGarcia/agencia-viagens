import { api } from "./api";
import type { Payment, TravelCost, FinancialReport } from "../types/financial";

const PATH = "/financial";

export const registerPayment = async (contractId: string, amount: number, method: string = "PIX"): Promise<Payment> => {
    const response = await api.post(`${PATH}/payments/${contractId}`, { amount, method });
    return response.data;
};

export const addTravelCost = async (travelId: string, cost: TravelCost): Promise<TravelCost> => {
    const response = await api.post(`${PATH}/costs/${travelId}`, cost);
    return response.data;
};

export const getFinancialReport = async (travelId: string): Promise<FinancialReport> => {
    const response = await api.get(`${PATH}/report/${travelId}`);
    return response.data;
};

export const deleteTravelCost = async (costId: string): Promise<void> => {
    await api.delete(`${PATH}/costs/${costId}`);
};
