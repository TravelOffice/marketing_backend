import { User } from '../../models';

export interface UpdateTenantUserUseCase {
  invoke: (tenantId: string, userId: string, user: User) => Promise<Partial<User>>;
}
