import { helper } from 'core';
import { PaymentVoucher, statusAllowUpdatePaymentVoucher } from '../models/PaymentVoucher';
import { paymentVoucherRepository } from '../repositories';
import { UpdatePaymentVoucherUseCase } from './interfaces/UpdatePaymentVoucherUseCase';
import { TOUR_OPERATION_INDEX, UPDATED_AT_INDEX } from '../utils/constants';

export default class UpdatePaymentVoucherUseCaseImpl implements UpdatePaymentVoucherUseCase {
  private allowedUpdatingKeys: (keyof PaymentVoucher)[] = [
    'amount',
    'description',
    'note',
    'deadline',
    'method',
    'signGroup',
    'attachment',
    'tourId',
  ];

  invoke = async (
    tenantId: string,
    id: string,
    paymentVoucher: PaymentVoucher,
  ) => {
    const now = Date.now();
    const existingPaymentVoucher = await paymentVoucherRepository.get(tenantId, id);
    if (!existingPaymentVoucher) {
      throw new Error(`Payment voucher [${id}] not found for tenant ${tenantId}`);
    }

    if (!statusAllowUpdatePaymentVoucher.includes(existingPaymentVoucher.status)) {
      throw new Error(`Only payment voucher with status ${statusAllowUpdatePaymentVoucher.join(', ')} can be updated`);
    }

    // Delete old attachment
    if (paymentVoucher.attachment !== ''
      && existingPaymentVoucher.attachment !== ''
      && paymentVoucher.attachment !== existingPaymentVoucher.attachment) {
      await paymentVoucherRepository.deleteAttachment(existingPaymentVoucher.attachment!);
    }
    const { tourId } = paymentVoucher;
    const receiptToUpdate: PaymentVoucher = {
      ...existingPaymentVoucher,
      ...helper.extractDataFromObject(paymentVoucher, this.allowedUpdatingKeys),
      updatedAt: now,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi5: tourId ? `${TOUR_OPERATION_INDEX}#${tourId}` : existingPaymentVoucher.lsi5,
    };

    await paymentVoucherRepository.update(
      tenantId,
      id,
      receiptToUpdate,
    );

    return helper.excludeDataFromObject(receiptToUpdate) as PaymentVoucher;
  };
}
