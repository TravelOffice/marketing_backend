import { rolePermissionRepository } from '../repositories';
import { CreateTenantRoleUseCase } from './interfaces/CreateTenantRoleUseCase';

export default class CreateTenantUserUseCaseImpl implements CreateTenantRoleUseCase {
  /**
   * Method to create Tenant role
   * To create Tenant role, there are steps need to do:
   * - Step 1: Confirm whether the role information exists or not
   * - Step 2: Confirm whether the permission information exists or not
   *           and also get permission information
   * - Step 3: Create the role
   * @param tenantId The id of the tenant
   * @param roleName The role name to be created
   * @param permissions The permissions which belong to a role to be created
   * @returns Promise<Role> All information of created role
   */
  invoke = async (tenantId: string, roleName: string, permissions: Array<string>) => {
    // Confirm role does not exist
    const existingRole = await rolePermissionRepository.getRole(tenantId, roleName);
    if (existingRole) throw new Error(`Role [${roleName}] already existed!`);

    // Confirm permission exist
    const allPermissions = await rolePermissionRepository.listPermissions();
    const createdPermission = permissions.map((permissionName) => {
      const permission = allPermissions.find((item) => item.name === permissionName);
      if (!permission) throw new Error(`Permission [${permissionName}] is not existed!`);
      return permission;
    });

    return rolePermissionRepository.createRole(tenantId, roleName, createdPermission);
  };
}
