import { receiptRepository } from '../repositories';
import { DeleteReceiptUseCase } from './interfaces/DeleteReceiptUseCase';

export default class DeleteReceiptUseCaseImpl implements DeleteReceiptUseCase {
  invoke = async (tenantId: string, id: string) => receiptRepository.delete(tenantId, id);
}
