import { Permission } from '../../models';

export interface RolePermissionRepository {
  hasPermission: (
    tenantId: string, roles: Array<string>, permission: Permission
  ) => Promise<boolean>
}
