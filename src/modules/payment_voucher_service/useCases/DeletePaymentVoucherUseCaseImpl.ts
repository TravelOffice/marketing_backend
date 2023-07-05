import { paymentVoucherRepository } from '../repositories';
import { DeletePaymentVoucherUseCase } from './interfaces/DeletePaymentVoucherUseCase';

export default class DeletePaymentVoucherUseCaseImpl implements DeletePaymentVoucherUseCase {
  invoke = async (tenantId: string, id: string) => paymentVoucherRepository.delete(tenantId, id);
}
