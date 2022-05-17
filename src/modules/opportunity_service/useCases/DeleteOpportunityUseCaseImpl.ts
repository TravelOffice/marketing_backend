import { opportunityRepository, userRepository } from '../repositories';
import { DeleteOpportunityUseCase } from './interfaces/DeleteOpportunityUseCase';

export default class DeleteOpportunityUseCaseImpl implements DeleteOpportunityUseCase {
  /**
   * To update opportunity, there are steps need to do:
   * - Step 1: Get current user from dynamo db
   * - Step 2: Get current opportunity from dynamo db
   * - Step 3: Delete opportunity from tenant partition and employee partition
   * @return pk, sk and all atributes of Opportunity
   */
  invoke = async (
    id: string,
    userId: string,
  ) => {
    const currentUser = await userRepository.getUserAttributes(userId);
    if (!currentUser) {
      throw new Error(`User ${userId} does not exists`);
    }
    const tenantId = currentUser.tenant;
    const opportunity = await opportunityRepository.getByAssignee(id, tenantId, userId);
    if (!opportunity) {
      throw new Error(`Opportunity ${id} does not exists`);
    }
    // Delete opportunity from tenant information
    await opportunityRepository.delete(opportunity, tenantId);
  };
}
