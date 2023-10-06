import { PaymentVoucher } from '../../models/PaymentVoucher';

export interface PaymentVoucherRepository {
  listByTour: (tenantId: string, tourId: string) => Promise<Array<PaymentVoucher>>
}
