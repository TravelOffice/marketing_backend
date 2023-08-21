import { MarketplaceUser } from '../../models';

export interface EnableMarketplaceUserUseCase {
  invoke: (
    userId: string,
    enable: boolean
  ) => Promise<MarketplaceUser>;
}
