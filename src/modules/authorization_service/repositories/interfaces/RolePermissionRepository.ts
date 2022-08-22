import { Permission, Role } from '../../models';

export interface RolePermissionRepository {
  getRole: (tenantId: string, roleName: string) => Promise<Role | undefined>
  createRole: (tenantId: string, roleName: string, permissions: Permission[]) => Promise<Role>
  listRoles: (tenantId: string) => Promise<Array<Role>>
  listPermissions: () => Promise<Array<Permission>>
  hasPermission: (
    tenantId: string, roles: Array<string>, permission: Permission
  ) => Promise<boolean>
}
