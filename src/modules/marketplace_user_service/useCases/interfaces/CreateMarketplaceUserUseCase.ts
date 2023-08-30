import { MarketplaceUser, UserWithRoles } from '../../models';

export interface CreateMarketplaceUserUseCase {
  invoke: (tenant: string, users: UserWithRoles) => Promise<MarketplaceUser>;
}
