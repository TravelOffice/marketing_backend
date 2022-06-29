import { pageRepository, userRepository } from '../repositories';
import { GetLinkedPagesUseCase } from './interfaces/GetLinkedPagesUserUseCase';

export default class GetLinkedPagesUseCaseImpl implements GetLinkedPagesUseCase {
  /**
   * Method to get the pages linked with current tenant
   * To get linked pages, there are steps need to do:
   * - Step 1: Confirm the user information existed in Dynamo DB
   * - Step 2: TODO Check current user has permission to get the linked pages
   * - Step 3: Get the current tenant from authenticated user
   * - Step 4: Get the linked pages
   * @param userId The id of retrieve user
   * @returns Promise<Array<Page>> All information of linked page
   */
  invoke = async (userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error(`Your account [${userId}] not existed!`);

    // TODO: Need check user permission before get linked pages

    // Get the current tenant from authenticated user
    const tenantId = userAttributes.tenant;
    if (!tenantId) throw new Error(`User [${userId}] is missing tenant attribute`);

    // Get the linked page
    return pageRepository.list(tenantId);
  };
}
