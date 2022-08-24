import { User } from '../../models';

export interface CreateTenantUserUseCase {
  invoke: (tenantId: string, user: User) => Promise<Partial<User>>;
}
