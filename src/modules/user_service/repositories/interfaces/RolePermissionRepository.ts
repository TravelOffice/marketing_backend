import { Role } from '../../models';

export interface RolePermissionRepository {
  listRoles: (tenantId: string) => Promise<Array<Role>>
}
