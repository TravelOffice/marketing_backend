import { BaseDdbModel } from 'common-models';

export enum PaymentVoucherStatus {
  WAIT_FOR_APPROVAL = 'WAIT_FOR_APPROVAL',
  APPROVED = 'APPROVED',
  WAIT_FOR_SIGN = 'WAIT_FOR_SIGN',
  SIGNED = 'SIGNED',
  WAIT_FOR_TRANSFER = 'WAIT_FOR_TRANSFER',
  TRANSFERED = 'TRANSFERED'
}

export enum PaymentVoucherMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER'
}

export interface PaymentVoucher extends BaseDdbModel {
  code: string,
  amount: number,
  receiver: string,
  description: string,
  note?: string,
  bookingId?: string,
  deadline?: string,
  method: PaymentVoucherMethod,
  signGroup: string,
  includeTax: boolean,
  quickApproval: boolean,
  attachment?: string,
  paymentVoucherStatus: PaymentVoucherStatus,
  creatorId: string,
  creatorName: string,
}
