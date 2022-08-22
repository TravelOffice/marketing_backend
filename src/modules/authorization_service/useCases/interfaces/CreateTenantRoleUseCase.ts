import { Role } from '../../models';

export interface CreateTenantRoleUseCase {
  invoke: (tenantId: string, roleName: string, permissions: Array<string>) => Promise<Role>
}
