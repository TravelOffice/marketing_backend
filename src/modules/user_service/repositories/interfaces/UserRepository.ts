import { User } from '../../models/User';

export interface UserRepository {
  getUserAttributes: (userId: string) => Promise<User | undefined>,
  list: () => Promise<Array<User>>
  create: (user: User) => Promise<User>
  get: (id: string | number) => Promise<User>
  update: (id: string | number, user: User) => Promise<User>
  delete: (id: string | number) => Promise<void>
}
