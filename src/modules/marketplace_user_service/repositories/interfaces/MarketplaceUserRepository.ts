import { MarketplaceUser, UserWithRoles } from '../../models';

export interface MarketplaceUserRepository {
  getById: (id: string) => Promise<MarketplaceUser | undefined>;
  addUser: (tenant: string, user: UserWithRoles) => Promise<MarketplaceUser>;
  addUsers: (tenant: string, users: UserWithRoles[]) => Promise<MarketplaceUser[]>;
  list: (organization: string) => Promise<MarketplaceUser[]>;
  update: (
    id: string,
    user: Partial<MarketplaceUser>
  ) => Promise<MarketplaceUser>;
}
