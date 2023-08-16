import { rolePermissionRepository, userRepository } from '../repositories';
import { DeleteTenantRoleUseCase } from './interfaces/DeleteTenantRoleUseCase';

export default class DeleteTenantUserUseCaseImpl implements DeleteTenantRoleUseCase {
  /**
   * Method to delete Tenant role
   * To  delete Tenant role, there are steps need to do:
   * - Step 1: Delete the role
   * @param tenantId The id of the tenant
   * @param roleName The role name to be deleted
   * @returns Promise<void> All information of deleted role
   */
  invoke = async (
    tenantId: string,
    roleName: string,
  ) => {
    const users = await userRepository.getUsersByRole(tenantId, roleName);
    if (users.length > 0) {
      throw new Error(`Role ${roleName} is attached to ${JSON.stringify(users)}`);
    }
    await rolePermissionRepository.deleteRole(tenantId, roleName);
  };
}
