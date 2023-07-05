import { helper } from 'core';
import { PaymentVoucher } from '../models/PaymentVoucher';
import { paymentVoucherRepository } from '../repositories';
import { UpdatePaymentVoucherUseCase } from './interfaces/UpdatePaymentVoucherUseCase';
import { STATUS_INDEX, UPDATED_AT_INDEX } from '../utils/constants';

export default class UpdatePaymentVoucherUseCaseImpl implements UpdatePaymentVoucherUseCase {
  private allowedUpdatingKeys: (keyof PaymentVoucher)[] = [
    'amount',
    'receiver',
    'description',
    'note',
    'bookingId',
    'deadline',
    'method',
    'signGroup',
    'includeTax',
    'quickApproval',
    'attachment',
    'paymentVoucherStatus',
  ];

  invoke = async (
    tenantId: string,
    id: string,
    paymentVoucher: PaymentVoucher,
  ) => {
    const now = Date.now();
    const existingTourLocation = await paymentVoucherRepository.get(tenantId, id);
    if (!existingTourLocation) {
      throw new Error(`Tour Location [${id}] not found for tenant ${tenantId}`);
    }
    const receiptToUpdate: PaymentVoucher = {
      ...existingTourLocation,
      ...helper.extractDataFromObject(paymentVoucher, this.allowedUpdatingKeys),
      updatedAt: now,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${paymentVoucher.paymentVoucherStatus}`,
    };

    await paymentVoucherRepository.update(
      tenantId,
      id,
      receiptToUpdate,
    );

    return helper.excludeDataFromObject(receiptToUpdate) as PaymentVoucher;
  };
}
