import { helper } from 'core';
import { PaymentVoucher } from '../models/PaymentVoucher';
import { paymentVoucherRepository } from '../repositories';
import { GetPaymentVoucherListUseCase } from './interfaces/GetPaymentVoucherListUseCase';

export default class GetPaymentVoucherListUseCaseImpl implements GetPaymentVoucherListUseCase {
  invoke = async (tenantId: string) => {
    const items = await paymentVoucherRepository.list(tenantId);
    // Formatting the items and exclude the key property
    return items.map(
      (item) => helper.excludeDataFromObject(item) as PaymentVoucher,
    );
  };
}
