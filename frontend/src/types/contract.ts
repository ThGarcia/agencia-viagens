import type { TravelResponse } from "./travel";

export interface Passenger {
  id?: string;
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
}

export interface ContractRequest {
  clientName: string;
  clientCpf: string;
  clientRg: string;
  clientBirthDate: string;
  clientPhone: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  travelId: string;
  passengers: Passenger[];
}

export interface ContractResponse extends Omit<ContractRequest, 'travelId'> {
  id: string;
  status: "PENDING" | "APPROVED" | "PAID" | "CONFIRMED" | "CANCELLED";
  priceTotal: number;
  paymentMethod: string;
  roomType: string;
  tokenAccess?: string;
  travel: TravelResponse;
}

export interface PassengerListDTO {
    number: number;
    name: string;
    cpf: string;
    birthDate: string;
    age: string;
    roomType: string;
}
