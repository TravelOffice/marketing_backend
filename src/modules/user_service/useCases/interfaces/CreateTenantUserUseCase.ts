import { User } from '../../models/User';

export interface CreateTenantUserUseCase {
  invoke: (authenticatedUserName: string, user: User) => Promise<User>;
}
