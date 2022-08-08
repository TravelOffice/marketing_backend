import { User } from '../../models/User';

export interface UserRepository {
  getEmployee: (tenant: string, userId: string) => Promise<User | undefined>,
}
