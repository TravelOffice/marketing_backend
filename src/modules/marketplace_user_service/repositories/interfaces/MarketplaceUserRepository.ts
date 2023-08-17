import { MarketplaceUser, TravelUser } from '../../models';

export interface MarketplaceUserRepository {
  getById: (id: string) => Promise<MarketplaceUser | undefined>;
  add: (user: TravelUser, roles: string[]) => Promise<MarketplaceUser>;
  list: (organizationId: string) => Promise<MarketplaceUser[]>;
  update: (id: string, user: Partial<MarketplaceUser>) => Promise<MarketplaceUser>;
}
