import { User } from '../../models/User';

export interface GetTenantUserUseCase {
  invoke: (userId: string) => Promise<User>;
}
