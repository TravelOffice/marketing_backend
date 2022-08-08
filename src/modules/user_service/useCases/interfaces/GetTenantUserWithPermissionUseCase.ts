import { User } from '../../models/User';

export interface GetTenantUserWithPermissionUseCase {
  invoke: (tenantId: string, userId: string) => Promise<User>;
}
