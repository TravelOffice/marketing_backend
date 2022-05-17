import { opportunityRepository, userRepository } from '../repositories';
import { DeleteOpportunityUseCase } from './interfaces/DeleteOpportunityUseCase';

export default class DeleteOpportunityUseCaseImpl implements DeleteOpportunityUseCase {
  /**
   * To update opportunity, there are steps need to do:
   * - Step 1: Get current user from dynamo db
   * - Step 2: Get current opportunity from dynamo db
   * - Step 3: If current user is current assignee, unassign opportunity in employee partition
   * - Step 4: Delete opportunity from tenant partition
   * @return pk, sk and all atributes of Opportunity
   */
  invoke = async (
    id: string,
    userId: string,
    leadId: string,
  ) => {
    const currentUser = await userRepository.getUserAttributes(userId);
    if (!currentUser) {
      throw new Error(`User ${userId} does not exists`);
    }
    const tenantId = currentUser.tenant;
    const opportunity = await opportunityRepository.get(id, tenantId, leadId);
    if (!opportunity) {
      throw new Error(`Opportunity ${id} does not exists`);
    }
    if (opportunity.assigneeId !== userId) {
      throw new Error(`You don't have permission to delete Opportunity ${id}`);
    }
    // Delete opportunity from current employee partition
    await opportunityRepository.unassign(id, tenantId, userId);
    // Delete opportunity from tenant information
    await opportunityRepository.delete(opportunity, tenantId);
  };
}
