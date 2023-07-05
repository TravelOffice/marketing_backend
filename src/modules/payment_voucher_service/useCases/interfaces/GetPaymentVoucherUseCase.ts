import { PaymentVoucher } from '../../models/PaymentVoucher';

export interface GetPaymentVoucherUseCase {
  invoke: (tenantId: string, id: string) => Promise<PaymentVoucher>;
}
