import { Lead } from '../models/Lead';
import { leadRepository } from '../repositories';
import { UpdateLeadUseCase } from './interfaces/UpdateLeadUseCase';

export default class UpdateLeadUseCaseImpl implements UpdateLeadUseCase {
  invoke = (
    tenantId: string,
    leadId: string,
    lead: Lead,
  ) => leadRepository.update(tenantId, leadId, lead);
}
