import { User } from '../../models/User';

export interface UserRepository {
  getUserAttributes: (userId: string) => Promise<User | undefined>,
  get: (tenantId: string, userId: string) => Promise<User | undefined>,
}
