import { BaseDdbModel } from 'common-models';

export interface MarketplaceUser extends BaseDdbModel {
  // Attributes from Travel Office TravelUser
  organization: string, // Tenant ID
  username: string, // Username of the user in isolated tenant
  id: string, // Combination of tenant and username
  name: string, // Full name of the user
  phoneNumber: string, // Phone number of the user
  avatar?: string, // THe avatar of the user

  // New attributes for marketplace
  alias?: string, // Alias of the user, this will be displayed instead of user ID
}
