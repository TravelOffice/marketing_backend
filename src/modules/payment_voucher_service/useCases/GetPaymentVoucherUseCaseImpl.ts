import logger from 'core/utils/logger';
import { helper } from 'core';
import { PaymentVoucher } from '../models/PaymentVoucher';
import { paymentVoucherRepository } from '../repositories';
import { GetPaymentVoucherUseCase } from './interfaces/GetPaymentVoucherUseCase';

export default class GetPaymentVoucherUseCaseImpl implements GetPaymentVoucherUseCase {
  invoke = async (tenantId: string, id: string) => {
    const receipt = await paymentVoucherRepository.get(tenantId, id);
    if (!receipt) {
      logger.log(`Could not found Payment voucher ${id} of tenant ${tenantId}`);
      throw new Error(`Could not found Payment voucher ${id}`);
    }
    return helper.excludeDataFromObject(receipt) as PaymentVoucher;
  };
}
