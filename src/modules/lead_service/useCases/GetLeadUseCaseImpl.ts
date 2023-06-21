import { leadRepository } from '../repositories';
import { GetLeadUseCase } from './interfaces/GetLeadUseCase';

export default class GetLeadUseCaseImpl implements GetLeadUseCase {
  invoke = (tenantId: string, leadId: string) => leadRepository.get(tenantId, leadId);
}
