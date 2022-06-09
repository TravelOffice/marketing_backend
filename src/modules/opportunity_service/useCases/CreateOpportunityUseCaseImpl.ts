import { Opportunity } from '../models/Opportunity';
import {
  leadRepository, noteRepository, opportunityRepository, taskRepository, userRepository,
} from '../repositories';
import { CreateOpportunityUseCase } from './interfaces/CreateOpportunityUseCase';

export default class CreateOpportunityUseCaseImpl implements CreateOpportunityUseCase {
  /**
   * Use case is used for the user (Employee) to create new Opportunity and associate to a Lead.
   * @param userId The id of the Employee, must be valid.
   * @param leadId The id of the Lead, must be valid.
   * @param opportunity The Opportunity information which should be stored.
   * @returns Promise of created Opportunity.
   */
  invoke = async (
    userId: string,
    leadId: string,
    opportunity: Opportunity,
  ) => {
    // Make sure the Employee exists
    const currentUser = await userRepository.getUserAttributes(userId);
    if (!currentUser) {
      throw new Error(`User ${userId} does not exists`);
    }
    const tenantId = currentUser.tenant;

    // Make sure the Lead exists
    const lead = await leadRepository.get(tenantId, leadId);
    if (!lead) {
      throw new Error(`Lead ${leadId} of tenant ${tenantId} does not exists`);
    }

    // Merge leadId and leadName into opportunity
    let opportunityToUpdate : Opportunity = {
      ...opportunity,
      leadId,
      leadName: lead.name,
      assigneeId: lead.assigneeId,
    };

    if (opportunity.tasks) {
      const tasks = taskRepository.generateData(opportunity.tasks, userId, currentUser.name);
      opportunityToUpdate = { ...opportunityToUpdate, tasks };
    }
    if (opportunity.notes) {
      const notes = noteRepository.generateData(opportunity.notes, userId, currentUser.name);
      opportunityToUpdate = { ...opportunityToUpdate, notes };
    }

    // Create new Opportunity
    return opportunityRepository.create(tenantId, leadId, userId, opportunityToUpdate);
  };
}
