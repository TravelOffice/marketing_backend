import { PaymentVoucher } from '../../models/PaymentVoucher';

export interface GetPaymentVoucherListUseCase {
  invoke: (tenantId: string) => Promise<Array<PaymentVoucher>>;
}
