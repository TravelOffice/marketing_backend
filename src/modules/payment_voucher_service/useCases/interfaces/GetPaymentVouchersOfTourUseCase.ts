import { PaymentVoucher } from '../../models/PaymentVoucher';

export interface GetPaymentVouchersOfTourUseCase {
  invoke: (tenantId: string, tourId: string) => Promise<Array<PaymentVoucher>>;
}
