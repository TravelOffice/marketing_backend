import { Lead } from '../models/Lead';
import { leadRepository, userRepository } from '../repositories';
import { GetLeadListByAssigneeUseCase } from './interfaces/GetLeadListByAssignee';


export default class GetLeadListByAssigneeUseCaseIpml implements GetLeadListByAssigneeUseCase {
  /**
   * To get a lead list by assignee:
   * - Step 1: Get user ID and tenant ID from dynamo db
   * - Step 2: Get all leads in the tenant having user ID as assignee ID
   * @return pk, sk and all atributes of all Lead match the condition
   */
  invoke = async (userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User is not existed!');
    const tenantId = userAttributes.tenant;
    return leadRepository.getLeadListByField(tenantId, 'assigneeId', userId);
  };
}
