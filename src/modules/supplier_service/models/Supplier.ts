import { BaseDdbModel } from 'common-models';

export enum ServiceType {
  TOUR = 'TOUR',
  ACCOMMODATION = 'ACCOMMODATION',
  RESTAURANT = 'RESTAURANT',
  VEHICLE = 'VEHICLE',
  TOUR_GUIDE = 'TOUR_GUIDE',
  TEAM_BUILDING = 'TEAM_BUILDING',
  SIGHT_SEEING_TICKET = 'SIGHT_SEEING_TICKET',
  FLIGHT_TICKET = 'FLIGHT_TICKET',
  OTHER = 'OTHER',
}

export interface Quote {
  name: string;
  price: number;
  unit: string;
  link: string;
  year: number;
  description: string;
}

export interface PaymentInfo {
  bankName: string,
  accountName: string;
  accountNumber: string;
  bankBranch: string;
}

export interface Contact {
  name: string;
  phoneNumber: string;
  email: string;
}

export const supplierServiceTypes = Object.keys(ServiceType);

export interface Supplier extends BaseDdbModel {
  code: string;
  name: string;
  brandName: string;
  establishmentYear: number;
  starRating: number;
  capacity: number;
  services: Array<ServiceType>;
  city: string;
  district: string;
  address: string;
  taxId: string;
  note: string;
  quotes: Array<Quote>;
  paymentInfo: Array<PaymentInfo>,
  contacts: Array<Contact>;
  creatorId?: string;
  creatorName?: string;
}
