import { api } from "./api";

export interface Travel {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    priceBase: number;
    departureDate: string;
    returnDate: string;
    status: string;
}

export const getTravels = async (): Promise<Travel[]> => {
    const response = await api.get("/travels");
    return response.data;
};

export const getTravelById = async (id: string): Promise<Travel> => {
    const response = await api.get(`/travels/${id}`);
    return response.data;
};
