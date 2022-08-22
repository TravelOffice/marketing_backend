import { rolePermissionRepository } from '../repositories';
import { GetListTenantRolesUseCase } from './interfaces/GetListTenantRolesUseCase';

export default class GetListTenantRolesUseCaseImpl implements GetListTenantRolesUseCase {
  /**
   * Method to get all roles belong to Tenant
   * @param tenantId The id of the Tenant
   * @returns Promise<User> All information of list tenant roles
   */
  invoke = async (tenantId: string) => rolePermissionRepository.listRoles(tenantId);
}
