import { MarketplaceUser } from '../../models';

export interface GetMarketplaceUserUseCase {
  invoke: (tenant: string, username: string) => Promise<MarketplaceUser>;
}
