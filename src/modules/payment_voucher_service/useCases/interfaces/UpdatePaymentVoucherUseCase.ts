import { PaymentVoucher } from '../../models/PaymentVoucher';

export interface UpdatePaymentVoucherUseCase {
  invoke: (tenantId: string, id: string, paymentVoucher: PaymentVoucher) => Promise<PaymentVoucher>;
}
