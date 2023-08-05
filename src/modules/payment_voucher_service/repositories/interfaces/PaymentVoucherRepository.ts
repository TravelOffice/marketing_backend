import { PaymentVoucher } from '../../models/PaymentVoucher';

export interface PaymentVoucherRepository {
  generatePaymentVoucherCode: (tenantId: string) => Promise<string>
  list: (tenantId: string) => Promise<Array<PaymentVoucher>>
  listByTour: (tenantId: string, tourId: string) => Promise<Array<PaymentVoucher>>
  create: (tenantId: string, paymentVoucher: PaymentVoucher) => Promise<PaymentVoucher>
  get: (tenantId: string, receiptId: string) => Promise<PaymentVoucher>
  update: (tenantId: string, id: string, paymentVoucher: PaymentVoucher) => Promise<PaymentVoucher>
  delete: (tenantId: string, id: string) => Promise<string>
}
