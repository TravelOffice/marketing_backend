import { MarketplaceUser } from '../../models/MarketplaceUser';

export interface MarketplaceUserRepository {
  getById: (id: string) => Promise<MarketplaceUser | undefined>;
}
