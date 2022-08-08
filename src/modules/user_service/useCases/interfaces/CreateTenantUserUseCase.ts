import { User } from '../../models/User';

export interface CreateTenantUserUseCase {
  invoke: (tenantId: string, user: User) => Promise<User>;
}
