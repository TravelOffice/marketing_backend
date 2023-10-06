import { BaseDdbModel } from 'common-models';

export enum PaymentVoucherStatus {
  WAIT_FOR_APPROVAL = 'WAIT_FOR_APPROVAL',
  APPROVED = 'APPROVED',
  WAIT_FOR_SIGN = 'WAIT_FOR_SIGN',
  SIGNED = 'SIGNED',
  WAIT_FOR_TRANSFER = 'WAIT_FOR_TRANSFER',
  TRANSFERRED = 'TRANSFERRED'
}

export const paymentVoucherMethods = [
  'CASH',
  'TRANSFER',
];

export type PaymentVoucherMethod = typeof paymentVoucherMethods[number]

export interface PaymentVoucher extends BaseDdbModel {
  code: string,
  amount: number,
  receiverId: string, // Supplier Id
  receiverName: string, // Supplier Name
  description: string,
  note?: string,
  tourId: string, // Tour operation
  deadline?: string,
  method: PaymentVoucherMethod,
  signGroup: string,
  includeTax?: boolean,
  quickApproval?: boolean,
  attachment?: string,
  status: PaymentVoucherStatus,
  creatorId: string,
  creatorName: string,
}
