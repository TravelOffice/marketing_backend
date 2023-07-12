import { BaseDdbModel } from 'common-models';

export enum ReceiptStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export interface Receipt extends BaseDdbModel {
  code: string,
  paymentMethod: string,
  status: ReceiptStatus,
  bookingId?: string,
  customerId?: string,
  customerName?: string,
  amount: number,
  description: string,
  note?: string,
  creatorId: string,
  creatorName: string,
}
