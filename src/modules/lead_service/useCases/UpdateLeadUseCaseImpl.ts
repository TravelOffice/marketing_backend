import { Lead } from '../models/Lead';
import { Opportunity } from '../models/Opportunity';
import { leadRepository, userRepository, opportunityRepository } from '../repositories';
import logger from '../utils/logger';
import { UpdateLeadUseCase } from './interfaces/UpdateLeadUseCase';

export default class UpdateLeadUseCaseImpl implements UpdateLeadUseCase {
  /**
   * To update lead, there are steps need to do:
   * - Step 1: Get tenant ID from dynamo db
   * - Step 2: Get old lead from dynamo db
   * - Step 3: Remove constant attribute from new lead
   * - Step 4: Merge new lead and old lead
   * - Step 5: If the Lead name has changed, go to update all
   *           opps belong to the Lead
   * - Step 6: Save lead information to dynamo db
   * @return pk, sk and all atributes of Lead
   */
  invoke = async (lead: Lead, userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User not existed!');
    const tenantId = userAttributes.tenant;
    if (!tenantId) throw new Error('User is missing tenant attribute');
    const {
      createdAt, creatorId, creatorName, ...newLead
    } = lead;
    const oldLead = await leadRepository.getById(tenantId, newLead.primaryPhoneNumber);
    if (!oldLead) throw new Error('Lead does not exist!');

    // Check whether update Opps or not
    if (oldLead.name !== lead.name) {
      // Get all opps which belong to the Lead
      const opportunities = await opportunityRepository
        .getAllByLeadId(tenantId, oldLead.primaryPhoneNumber);
      if (opportunities.length > 0) {
        const updateOpportunityPromises = opportunities?.map(async (opportunity: Opportunity) => {
          const newOpportunity = { ...opportunity, leadName: lead.name };
          logger.log(`
            Opportunity updating new Lead name with id = ${newOpportunity.createdAt},
            leadId = ${lead.primaryPhoneNumber}, tenantId = ${tenantId},
            leadName = ${lead.name}`);
          // Update opportunity with new Lead name
          await opportunityRepository.update(newOpportunity, tenantId);
        });
        await Promise.all(updateOpportunityPromises);
      }
    }

    return leadRepository.createOrUpdate(tenantId, Object.assign(oldLead, newLead));
  };
}
