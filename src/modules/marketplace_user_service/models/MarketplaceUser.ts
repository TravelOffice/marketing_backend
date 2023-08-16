import { BaseDdbModel } from 'common-models';
import { LANGUAGES_TYPE, THEMES_TYPE } from './User';

export interface MarketplaceUser extends BaseDdbModel {
  // Attributes from Travel Office User
  tenant: string, // Tenant ID
  username: string, // Username of the user in isolated tenant
  id: string, // Combination of tenant and username
  name: string, // Full name of the user
  phoneNumber: string, // Phone number of the user
  avatar?: string, // THe avatar of the user
  settings: {
    language?: LANGUAGES_TYPE,
    theme?: THEMES_TYPE
  },

  // New attributes for marketplace
  alias: string, // Alias of the user, this will be displayed instead of user ID
  roleStr: string, // THe roles of current user
  enabled: boolean,
}
