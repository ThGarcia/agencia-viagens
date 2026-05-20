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
    totalExpected: number;    
    totalReceived: number;   
    totalRemaining: number;   
    totalCosts: number;
    totalPayments: number;
    actualProfit: number;     
    projectedProfit: number;       
    totalPassengers: number;
    costs: TravelCost[];
}
