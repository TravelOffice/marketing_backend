import { Opportunity } from '../models/Opportunity';
import { opportunityRepository, userRepository } from '../repositories';
import { UpdateOpportunityUseCase } from './interfaces/UpdateOpportunityUseCase';

export default class UpdateOpportunityUseCaseImpl implements UpdateOpportunityUseCase {
  /**
   * To update opportunity, there are steps need to do:
   * - Step 1: Get current user from dynamo db
   * - Step 2: Get old opportunity from dynamo db
   * - Step 3: If old opportunity's assigneeId different from new,
   *           unassign opportunity in employee partition
   * - Step 4: Remove constant attribute from new opportunity
   * - Step 5: Merge new opportunity and old opportunity
   * - Step 6: Save opportunity information to dynamo db
   * @return pk, sk and all atributes of Opportunity
   */
  invoke = async (
    id: string,
    userId: string,
    leadId: string,
    opportunity: Omit<Opportunity, 'createdAt' | 'leadId'>,
  ) => {
    const currentUser = await userRepository.getUserAttributes(userId);
    if (!currentUser) {
      throw new Error(`User ${userId} does not exists`);
    }
    const tenantId = currentUser.tenant;
    const oldOpportunity = await opportunityRepository.get(id, tenantId, leadId);
    if (!oldOpportunity) {
      throw new Error(`Opportunity ${id} does not exists`);
    }
    // TODO: Need to check whether Opportunity belong to current user or not
    if (oldOpportunity.assigneeId !== opportunity.assigneeId) {
      await opportunityRepository.unassign(id, tenantId, oldOpportunity.assigneeId);
    }
    return opportunityRepository.update(
      Object.assign(oldOpportunity, opportunity),
      tenantId,
    );
  };
}
