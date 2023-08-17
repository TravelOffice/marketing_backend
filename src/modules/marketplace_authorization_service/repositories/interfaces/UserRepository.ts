import { MarketplaceUser } from '../../models/MarketplaceUser';

export interface UserRepository {
  getUserAttributes: (tenantId: string, userId: string) => Promise<MarketplaceUser | undefined>,
  getUsersByRole: (tenantId: string, role: string) => Promise<Array<string>>,
  getUserPermissions: (tenantId: string, user: MarketplaceUser) => Promise<Array<string>>,
}
