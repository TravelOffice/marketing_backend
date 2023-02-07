import { User, UserWithPermission } from '../../models';

export interface UserRepository {
  getUserAttributes: (tenantId: string, userId: string) => Promise<User | undefined>,
  list: (tenantId: string) => Promise<Array<User>>
  create: (tenantId: string, user: User) => Promise<User>
  get: (tenantId: string, userId: string) => Promise<User>
  getWithPermission: (tenantId: string, userId: string) => Promise<UserWithPermission>
  updateToAuthenticationProvider: (tenantId: string, user: User) => Promise<User>
  updateToDatabase: (tenantId: string, user: User) => Promise<User>
  update: (tenantId: string, user: User) => Promise<User>
  delete: (tenantId: string, userId: string) => Promise<void>
}
