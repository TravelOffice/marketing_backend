import { User } from '../../models/User';

export interface GetTenantUserListUseCase {
  invoke: (authenticatedUserName: string) => Promise<Array<User>>;
}
