import { helper } from 'core';
import { PaymentVoucher } from '../models/PaymentVoucher';
import { paymentVoucherRepository } from '../repositories';
import { GetPaymentVouchersOfTourUseCase } from './interfaces/GetPaymentVouchersOfTourUseCase';

export default class GetPaymentVouchersOfTourUseCaseImpl
implements GetPaymentVouchersOfTourUseCase {
  invoke = async (tenantId: string, tourId: string) => {
    const items = await paymentVoucherRepository.listByTour(tenantId, tourId);
    // Formatting the items and exclude the key property
    return items.map(
      (item) => helper.excludeDataFromObject(item) as PaymentVoucher,
    );
  };
}
