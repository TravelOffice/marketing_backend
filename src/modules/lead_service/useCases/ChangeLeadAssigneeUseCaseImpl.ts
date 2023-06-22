import { leadRepository, userRepository } from '../repositories';
import logger from '../utils/logger';
import { ChangeLeadAssigneeUseCase } from './interfaces/ChangeLeadAssigneeUseCase';

export default class ChangeLeadAssigneeUseCaseImpl implements ChangeLeadAssigneeUseCase {
  invoke = async (tenantId: string, leadId: string, assignee: string) => {
    logger.log(`Invoking status change for lead ${leadId} with assignee ${assignee}`);

    // Retrieve the user attributes based on the tenantId and userId
    const userAttributes = await userRepository.getUserAttributes(tenantId, assignee);

    // Validate user information
    if (!userAttributes) {
      throw new Error(`User ${assignee} does not exist!`);
    }

    logger.log('User information validated successfully.');

    // Retrieve the lead based on the tenantId and leadId
    const lead = await leadRepository.getById(tenantId, leadId);

    // Validate lead information
    if (!lead) {
      throw new Error('Lead does not exist!');
    }

    logger.log('Lead information validated successfully.');

    // Change the status of the lead
    const updatedLead = await leadRepository.changeAssignee(tenantId, leadId, assignee);

    logger.log(`Assginee of lead ${leadId} changed to ${assignee} successfully.`);

    // TODO: notification

    return updatedLead;
  };
}
