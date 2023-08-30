import { UserWithRoles } from '../../models';

export interface CreateMultiMarketplaceUserUseCase {
  invoke: (
    tenant: string,
    users: UserWithRoles[]
  ) => any;
}
