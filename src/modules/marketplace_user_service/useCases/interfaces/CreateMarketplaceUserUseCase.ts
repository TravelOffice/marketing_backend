import { MarketplaceUser } from '../../models';

export interface CreateMarketplaceUserUseCase {
  invoke: (tenant: string, username: string, roles: string[]) => Promise<MarketplaceUser>;
}
