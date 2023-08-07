import { paymentVoucherRepository } from '../repositories';
import { DeletePaymentVoucherUseCase } from './interfaces/DeletePaymentVoucherUseCase';

export default class DeletePaymentVoucherUseCaseImpl implements DeletePaymentVoucherUseCase {
  invoke = async (tenantId: string, id: string) => {
    const existingPaymentVoucher = await paymentVoucherRepository.get(tenantId, id);
    if (!existingPaymentVoucher) {
      throw new Error(`Payment voucher [${id}] not found for tenant ${tenantId}`);
    }

    // delete information in dynamodb
    await paymentVoucherRepository.delete(tenantId, id);

    // Delete attachment in s3 bucket
    if (existingPaymentVoucher.attachment) {
      await paymentVoucherRepository.deleteAttachment(existingPaymentVoucher.attachment);
    }

    return id;
  };
}
