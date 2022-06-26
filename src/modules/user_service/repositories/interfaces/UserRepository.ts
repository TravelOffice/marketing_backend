import { User } from '../../models/User';

export interface UserRepository {
  getUserAttributes: (userId: string) => Promise<User | undefined>,
  list: (tenantId: string) => Promise<Array<User>>
  create: (tenantId: string, user: User) => Promise<User>
  get: (tenantId: string, userId: string) => Promise<User>
  update: (tenantId: string, user: User) => Promise<User>
  delete: (tenantId: string, userId: string) => Promise<void>
}
