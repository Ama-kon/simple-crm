export interface Property {
  id: string;
  type: string;
  streetNumber: string;
  zipCity: string;
  price: number;
  sqmPrice: number;
  yearbuilt: number;
  livingSpace: number;
  landArea?: number;
  parking: string;
  available: number; //timestamp
  owner: string;
  ownerPhone: number;
  ownerMail: string;
  ownerAdress: string;
  imageUrls: string[];
  status: string;
}
