export interface Payment {
    id: string;
    amount: number;
    paymentDate: string;
    method: string;
}

export interface TravelCost {
    id?: string;
    description: string;
    value: number;
    perPerson: boolean;
}

export interface FinancialReport {
    totalExpected: number;    // Bruto vendido
    totalReceived: number;    // Já pago
    totalRemaining: number;   // Falta receber
    totalCosts: number;       // Gastos (Bus/Hotel)
    netProfit: number;        // Lucro real/projetado
    confirmedPassengers: number;
    costs: TravelCost[];
}
