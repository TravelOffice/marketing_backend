import { Lead } from '../models/Lead';
import { leadRepository, userRepository } from '../repositories';
import { UpdateLeadUseCase } from './interfaces/UpdateLeadUseCase';

export default class UpdateLeadUseCaseImpl implements UpdateLeadUseCase {
  /**
   * To update lead, there are steps need to do:
   * - Step 1: Get tenant ID from dynamo db
   * - Step 2: Get old lead from dynamo db
   * - Step 3: Remove constant attribute from new lead
   * - Step 4: Merge new lead and old lead
   * - Step 5: Save lead information to dynamo db
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
    return leadRepository.createOrUpdate(tenantId, Object.assign(oldLead, newLead));
  };
}
