import { BaseDdbModel } from 'common-models';

// eslint-disable-next-line no-shadow
export enum THEMES_TYPE {
  DARK = 'dark',
  LIGHT = 'light'
}

// eslint-disable-next-line no-shadow
export enum LANGUAGES_TYPE {
  ENGLISH = 'en',
  VIETNAMESE = 'vi'
}

export interface MarketplaceUser extends BaseDdbModel {
  // Attributes from Travel Office TravelUser
  organization: string, // Organization ID
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
  alias?: string, // Alias of the user, this will be displayed instead of user ID
  description?: string, // The description of the user
  roles: string[], // The roles of current user
  roleStr: string, // The roles string
  enabled: boolean,
}
