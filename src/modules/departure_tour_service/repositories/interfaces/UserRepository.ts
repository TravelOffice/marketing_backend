import { User } from '../../models/User';

export interface UserRepository {
  getUserAttributes: (tenantId: string, userId: string) => Promise<User | undefined>,
  listByRole: (tenantId: string, role: string) => Promise<User[]>;
}
