import { User } from '../../models/User';

export interface GetTenantUserListUseCase {
  invoke: (tenantId: string) => Promise<Array<Partial<User>>>;
}
