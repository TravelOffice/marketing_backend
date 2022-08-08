import { pageRepository } from '../repositories';
import { GetLinkedPagesUseCase } from './interfaces/GetLinkedPagesUserUseCase';

export default class GetLinkedPagesUseCaseImpl implements GetLinkedPagesUseCase {
  /**
   * Method to get the pages linked with current tenant
   * To get linked pages, there are steps need to do:
   * - Step 1: Confirm the user information existed in Dynamo DB
   * - Step 2: TODO Check current user has permission to get the linked pages
   * - Step 3: Get the current tenant from authenticated user
   * - Step 4: Get the linked pages
   * @param tenantId The id of the Tenant
   * @returns Promise<Array<Page>> All information of linked page
   */
  invoke = async (tenantId: string) => pageRepository.list(tenantId);
}
