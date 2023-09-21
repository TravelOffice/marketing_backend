import { helper } from 'core';
import { PaymentVoucher, PaymentVoucherStatus } from '../models/PaymentVoucher';
import { paymentVoucherRepository } from '../repositories';
import { STATUS_INDEX, UPDATED_AT_INDEX } from '../utils/constants';
import { ApprovePaymentVoucherUseCase } from './interfaces/ApprovePaymentVoucherUseCase';

export default class ApprovePaymentVoucherUseCaseImpl implements ApprovePaymentVoucherUseCase {
  invoke = async (
    tenantId: string,
    id: string,
  ) => {
    const now = Date.now();
    const existingPaymentVoucher = await paymentVoucherRepository.get(tenantId, id);
    if (!existingPaymentVoucher) {
      throw new Error(`Payment voucher [${id}] not found for tenant ${tenantId}`);
    }

    // Check status, only WAIT_FOR_APPROVAL can be approved
    if (existingPaymentVoucher.status !== PaymentVoucherStatus.WAIT_FOR_APPROVAL) {
      throw new Error(`Only payment voucher with status ${PaymentVoucherStatus.WAIT_FOR_APPROVAL} can be approved`);
    }

    const paymentVoucherToUpdate: PaymentVoucher = {
      ...existingPaymentVoucher,
      status: PaymentVoucherStatus.APPROVED,
      updatedAt: now,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${PaymentVoucherStatus.APPROVED}`,
    };

    await paymentVoucherRepository.update(
      tenantId,
      id,
      paymentVoucherToUpdate,
    );

    return helper.excludeDataFromObject(paymentVoucherToUpdate) as PaymentVoucher;
  };
}
