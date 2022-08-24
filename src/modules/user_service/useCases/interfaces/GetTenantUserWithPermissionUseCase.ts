import { User } from '../../models';

export interface GetTenantUserWithPermissionUseCase {
  invoke: (tenantId: string, userId: string) => Promise<Partial<User>>;
}
