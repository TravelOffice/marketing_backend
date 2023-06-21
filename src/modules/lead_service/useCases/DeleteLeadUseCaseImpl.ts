import { leadRepository } from '../repositories';
import { DeleteLeadUseCase } from './interfaces/DeleteLeadUseCase';

export default class DeleteLeadUseCaseImpl implements DeleteLeadUseCase {
  invoke = async (tenantId: string, leadId: string) => leadRepository.delete(tenantId, leadId);
}
