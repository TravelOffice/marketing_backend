import { Role } from '../../models';

export interface UpdateTenantRoleUseCase {
  invoke: (tenantId: string, roleName: string, permissions: Array<string>) => Promise<Role>
}
