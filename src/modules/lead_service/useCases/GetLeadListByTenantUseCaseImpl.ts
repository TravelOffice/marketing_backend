import { leadRepository, userRepository, cognitoUserRepository } from '../repositories';
import { GetLeadListByTenantUseCase } from './interfaces/GetLeadListByTenant';

export default class GetLeadListByTenantUseCaseIpml implements GetLeadListByTenantUseCase {
  /**
   * To get a lead list by assignee:
   * - Step 1: Get user ID and tenant ID from dynamo db
   * - Step 2: Get all leads in the tenant having user ID as assignee ID
   * @return pk, sk and all atributes of all Lead match the condition
   */
  invoke = async (userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User is not existed!');
    const cognitoUserAttributes = await cognitoUserRepository.getCognitoUserAttributes(userId);
    if (!cognitoUserAttributes) throw new Error('Cognito User is not existed!');
    const isAdmin = cognitoUserAttributes.get('custom:role') === 'ADMIN';
    if (!isAdmin) throw new Error('User does not have permission to get all leads!');
    const tenantId = userAttributes.tenant;
    return leadRepository.getLeadListByTenant(tenantId);
  };
}
