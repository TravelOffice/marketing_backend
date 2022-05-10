import { opportunityRepository, userRepository } from '../repositories';
import { GetOpportunityUseCase } from './interfaces/GetOpportunityUseCase';

export default class GetOpportunityUseCaseImpl implements GetOpportunityUseCase {
  invoke = async (id: string, userId: string, leadId: string) => {
    const currentUser = await userRepository.getUserAttributes(userId);
    if (!currentUser) {
      throw new Error(`User ${userId} does not exist`);
    }
    const tenantId = currentUser.tenant;
    const opportunity = await opportunityRepository.get(id, tenantId, leadId);
    if (!opportunity) {
      throw new Error(`Opportunity ${id} does not exist`);
    }
    return opportunity;
  };
}
