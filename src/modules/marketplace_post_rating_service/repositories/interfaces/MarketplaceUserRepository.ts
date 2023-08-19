import { MarketplaceUser } from '../../models/MarketplaceUser';

export interface MarketplaceUserRepository {
  getById(id: string): Promise<Partial<MarketplaceUser> | undefined>,

  getByAlias(alias: string): Promise<Partial<MarketplaceUser> | undefined>,
}
