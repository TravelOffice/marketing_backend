import { BaseDdbModel } from 'common-models';
import { ServiceType } from './Supplier';

export const vatStatuses = [
  'VAT_NONE',
  'VAT_INCLUDED',
  'NO_INVOICE',
];

export type VatStatus = typeof vatStatuses[number];

export const payerTypes = [
  'ORGANIZATION',
  'TOUR_GUIDE',
];

export type PayerTypes = typeof payerTypes[number]

export interface DdbEstimationModel extends BaseDdbModel {
  code: string,
  name: string,
  tourId: string,
  supplierId: string,
  serviceType: ServiceType,
  payer: PayerTypes,
  estimatedPrice: number,
  estimatedQuantity: number,
  actualPrice: number,
  actualQuantity: number,
  note: string,
  vat: number,
  vatStatus: VatStatus,
  creatorId: string,
  creatorName: string,
}

export type Estimation = Omit<DdbEstimationModel, 'pk' | 'sk'>;
