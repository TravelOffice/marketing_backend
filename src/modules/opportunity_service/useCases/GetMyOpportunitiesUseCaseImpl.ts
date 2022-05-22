import { OpportunityStatus } from '../models/Opportunity';
import { userRepository, opportunityRepository } from '../repositories';
import { GetMyOpportunitiesUseCase } from './interfaces/GetMyOpportunitiesUseCase';

export default class GetMyOpportunitiesUseCaseImpl implements GetMyOpportunitiesUseCase {
  invoke = async (userId: string, status?: OpportunityStatus) => {
    const currentUser = await userRepository.getUserAttributes(userId);
    if (!currentUser) {
      throw new Error('User does not exist');
    }
    const tenantId = currentUser.tenant;
    return opportunityRepository.getListByAssignee(tenantId, userId, status);
  };
}
