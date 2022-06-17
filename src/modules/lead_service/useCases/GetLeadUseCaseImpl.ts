import { leadRepository, userRepository } from '../repositories';
import { GetLeadUseCase } from './interfaces/GetLeadUseCase';

export default class GetLeadUseCaseImpl implements GetLeadUseCase {
  /**
   * To get lead by ID, there are steps need to do:
   * - Step 1: Get tenant ID from dynamo   db
   * - Step 2: Get lead from dynamo db
   * @return Lead Object
   */
  invoke = async (leadId: string, userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User does not exist!');
    const tenantId = userAttributes.tenant;
    const lead = await leadRepository.getById(tenantId, leadId);
    if (!lead) throw new Error('Lead does not exist!');
    return lead;
  };
}
