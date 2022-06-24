import { User } from '../../models/User';

export interface UpdateUserUseCase {
  invoke: (id: string, user: User) => Promise<User>;
}
