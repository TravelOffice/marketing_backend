import { MarketplaceUser } from '../../models';

export interface GetMarketplaceUserUseCase {
  invoke: (id: string) => Promise<MarketplaceUser>;
}
