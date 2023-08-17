import { MarketplaceUser } from '../../models';

export interface EnableMarketplaceUserUseCase {
  invoke: (
    tenant: string,
    username: string,
    enable: boolean
  ) => Promise<MarketplaceUser>;
}
