import { Role } from '../../models';

export interface GetListTenantRolesUseCase {
  invoke: (tenantId: string) => Promise<Array<Role>>
}
