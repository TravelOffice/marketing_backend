import { MarketplaceUser, UserWithRoles } from '../../models';

export interface CreateMarketplaceUserUseCase {
  invoke: (
    tenant: string,
    users: UserWithRoles | UserWithRoles[]
  ) => Promise<
    | MarketplaceUser
    | { processedUsers: MarketplaceUser[]; unprocessedUsers: MarketplaceUser[] }
  >;
}
