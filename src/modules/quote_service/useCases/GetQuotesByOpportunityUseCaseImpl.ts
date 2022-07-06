import { quoteRepository, userRepository } from '../repositories';
import { GetQuotesByOpportunityUseCase } from './interfaces/GetQuotesByOpportunityUseCase';

export default class GetQuotesByOpportunityUseCaseImpl implements GetQuotesByOpportunityUseCase {
  invoke = async (
    userId: string,
    leadId: string,
    opportunityId: string,
    status?: string,
  ) => {
    const currentUser = await userRepository.getUserAttributes(userId);
    if (!currentUser) {
      throw new Error('User does not exist');
    }
    const tenantId = currentUser.tenant;
    return quoteRepository.getListByOpportunity(tenantId, leadId, opportunityId, status);
  };
}
