import { PaymentVoucher } from '../../models/PaymentVoucher';

export interface ApprovePaymentVoucherUseCase {
  invoke: (tenantId: string, id: string) => Promise<PaymentVoucher>;
}
