import { User } from '../../models/User';

export interface GetTenantUserUseCase {
  invoke: (tenantId: string, userId: string) => Promise<Partial<User>>;
}
