import { User } from '../../models/User';

export interface UpdateTenantUserUseCase {
  invoke: (authenticatedUserName: string, userId: string, user: User) => Promise<User>;
}
