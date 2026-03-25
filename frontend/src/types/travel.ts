export interface TravelRequest {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  departureDate: string;
  returnDate: string;
  year: number;
  priceBase: number;
  priceDescription: string;
  inclusions: string[];
  observations: string[];
}

export interface TravelResponse extends TravelRequest {
  id: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
}
