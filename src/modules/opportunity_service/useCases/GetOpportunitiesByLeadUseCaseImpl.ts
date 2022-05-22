import { OpportunityStatus } from '../models/Opportunity';
import { userRepository, opportunityRepository } from '../repositories';
import { GetOpportunitiesByLeadUseCase } from './interfaces/GetOpportunitiesByLeadUseCase';

export default class GetOpportunitiesByLeadUseCaseImpl implements GetOpportunitiesByLeadUseCase {
  invoke = async (userId: string, leadId: string, status?: OpportunityStatus) => {
    const currentUser = await userRepository.getUserAttributes(userId);
    if (!currentUser) {
      throw new Error('User does not exist');
    }
    const tenantId = currentUser.tenant;
    const opportunities = await opportunityRepository.getListByLead(tenantId, leadId, status);
    return opportunities;
  };
}
