import { Lead } from '../models/Lead';
import { leadRepository, userRepository } from '../repositories';
import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';

export default class CreateLeadUseCaseIpml implements CreateLeadUseCase {
  /**
   * To create lead, there are steps need to do:
   * - Step 1: Get tenant ID from dynamo db
   * - Step 2: Save lead information to dynamo db
   * @return pk, sk and all atributes of Lead
   */
  invoke = async (lead: Lead, userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User not existed!');
    const tenantId = userAttributes.tenant;
    if (!tenantId) throw new Error('User is missing tenant attribute');
    return leadRepository.createOrUpdate(tenantId, lead);
  };
}
