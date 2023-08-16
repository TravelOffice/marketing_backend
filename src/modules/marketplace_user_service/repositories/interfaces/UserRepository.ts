import { MarketplaceUser, User } from '../../models';

export interface UserRepository {
  add: (user: User) => Promise<MarketplaceUser>;
  list: (organizationId: string) => Promise<MarketplaceUser[]>;
  remove: (id: string) => Promise<void>;
  update: (user: MarketplaceUser) => Promise<MarketplaceUser>;
}
