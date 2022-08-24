import {
  GroupPermission, Permission, PermissionStatement, Role,
} from '../../models';

export interface RolePermissionRepository {
  getRole: (tenantId: string, roleName: string) => Promise<Role | undefined>
  createRole: (tenantId: string, roleName: string, permissions: Permission[]) => Promise<Role>
  listRoles: (tenantId: string) => Promise<Array<Role>>
  listPermissions: () => Promise<Array<Permission>>
  listGroupPermissions: () => Promise<Array<GroupPermission>>
  hasPermission: (
    tenantId: string, roles: Array<string>, permission: PermissionStatement
  ) => Promise<boolean>
}
