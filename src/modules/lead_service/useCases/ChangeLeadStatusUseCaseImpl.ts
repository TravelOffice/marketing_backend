import { CHANGING_STATUS_RULES, LeadStatus } from '../models/Lead';
import { leadRepository, userRepository } from '../repositories';
import logger from '../utils/logger';
import { ChangeLeadStatusUseCase } from './interfaces/ChangeLeadStatusUseCase';

export default class ChangeLeadStatusUseCaseImpl implements ChangeLeadStatusUseCase {
  /**
   * Invokes a change in the status of a lead for a specific user and tenant.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} userId - The ID of the user performing the status change.
   * @param {string} leadId - The ID of the lead to change the status for.
   * @param {LeadStatus} status - The new status to set for the lead.
   * @returns {Promise<Lead>} - A promise that resolves to the updated lead after the status change.
   * @throws {Error} - If the user or lead information is invalid orthe status change isn't allowed.
   */
  invoke = async (tenantId: string, userId: string, leadId: string, status: LeadStatus) => {
    logger.log(`Invoking status change for lead ${leadId} with status ${status}`);

    // Retrieve the user attributes based on the tenantId and userId
    const userAttributes = await userRepository.getUserAttributes(tenantId, userId);

    // Validate user information
    if (!userAttributes) {
      throw new Error('User does not exist!');
    }

    logger.log('User information validated successfully.');

    // Retrieve the lead based on the tenantId and leadId
    const lead = await leadRepository.getById(tenantId, leadId);

    // Validate lead information
    if (!lead) {
      throw new Error('Lead does not exist!');
    }

    logger.log('Lead information validated successfully.');

    // Check if the status change is allowed based on the current and new status
    if (!CHANGING_STATUS_RULES.includes(`${lead.leadStatus}-${status}`)) {
      throw new Error(`Cannot change status from '${lead.leadStatus}' to '${status}'`);
    }
    logger.log('Status change allowed.');

    // Change the status of the lead
    const updatedLead = await leadRepository.changeStatus(tenantId, leadId, status);

    logger.log(`Status of lead ${leadId} changed to ${status} successfully.`);

    return updatedLead;
  };
}
