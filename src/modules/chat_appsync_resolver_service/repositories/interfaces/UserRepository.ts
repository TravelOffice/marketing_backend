import { User } from '../../models';

export interface UserRepository {
  getUserAttributes: (tenantId: string, userId: string) => Promise<User | undefined>,
}
