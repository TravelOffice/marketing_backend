import { User } from '../../models/User';

export interface UpdateTenantUserUseCase {
  invoke: (tenantId: string, userId: string, user: User) => Promise<Partial<User>>;
}
