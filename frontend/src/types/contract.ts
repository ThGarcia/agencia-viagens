export interface Passenger {
  name: string;
  cpf: string;
  birthDate: string;
  roomType: string;
}

export interface ContractRequest {
  clientName: string;
  clientCpf: string;
  clientBirthDate: string;
  clientPhone: string;
  travelId: string;
  passengers: Passenger[];
}
