import { User } from '../../models';

export interface UserRepository {
  getUserAttributes: (tenantId: string, userId: string) => Promise<User | undefined>,
  getUsersByRole: (tenantId: string, role: string) => Promise<Array<string>>,
  getUserPermissions: (tenantId: string, user: User) => Promise<Array<string>>,
}
