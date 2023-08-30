import { MarketplaceUser, UserWithRoles } from '../../models';

export interface MarketplaceUserRepository {
  getById: (id: string) => Promise<MarketplaceUser | undefined>;
  add: (tenant: string, user: UserWithRoles) => Promise<MarketplaceUser>;
  list: (organization: string) => Promise<MarketplaceUser[]>;
  update: (
    id: string,
    user: Partial<MarketplaceUser>
  ) => Promise<MarketplaceUser>;
  buildBatchWriteUser: (
    tenant: string,
    users: UserWithRoles[]
  ) => any;
  executeBatchWrite: (users: MarketplaceUser[]) => any;
}
