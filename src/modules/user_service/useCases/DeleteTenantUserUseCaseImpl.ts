import { userRepository } from '../repositories';
import { DeleteTenantUserUseCase } from './interfaces/DeleteTenantUserUseCase';

export default class DeleteTenantUserUseCaseImpl implements DeleteTenantUserUseCase {
  invoke = async (authenticatedUserName: string, userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(authenticatedUserName);
    if (!userAttributes) throw new Error(`Your account [${authenticatedUserName}] not existed!`);

    const tenantId = userAttributes.tenant;
    if (!tenantId) throw new Error(`User [${authenticatedUserName}] is missing tenant attribute`);

    return userRepository.delete(tenantId, userId);
  };
}
