import { CHANGING_STATUS_RULES, LeadStatus } from '../models/Lead';
import { leadRepository } from '../repositories';
import logger from '../utils/logger';
import { CancelLeadUseCase } from './interfaces/CancelLeadUseCase';

export default class CancelLeadUseCaseImpl implements CancelLeadUseCase {
/**
 * Invokes the cancellation of a lead for a specific user and tenant.
 *
 * @param {string} tenantId - The ID of the tenant.
 * @param {string} leadId - The ID of the lead to cancel.
 * @param {string} reason - The reason for the cancellation.
 * @returns {Promise<Lead>} - A promise that resolves to the canceled lead.
 * @throws {Error} - If the user or lead information is invalid or the cancellation is not allowed.
 */
  invoke = async (tenantId: string, leadId: string, reason: string) => {
    // Retrieve the lead based on the tenantId and leadId
    const lead = await leadRepository.getById(tenantId, leadId);

    // Validate lead information
    if (!lead) {
      throw new Error('Lead does not exist!');
    }

    // Check if the cancellation is allowed based on the lead status and cancellation rules
    if (!CHANGING_STATUS_RULES.includes(`${lead.leadStatus}-${LeadStatus.CANCEL}`)) {
      throw new Error(`Cannot change status from '${lead.leadStatus}' to '${LeadStatus.CANCEL}'`);
    }

    // Cancel the lead
    logger.log(`[CancelleadUseCaseImpl]: Lead ${leadId} was canceled with the reason '${reason}'`);
    // TODO: notification
    return leadRepository.cancel(tenantId, leadId, reason);
  };
}
