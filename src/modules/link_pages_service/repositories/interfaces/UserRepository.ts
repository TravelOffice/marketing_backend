import { User } from '../../models/User';

export interface UserRepository {
  getUserAttributes: (userId: string) => Promise<User | undefined>,
}
