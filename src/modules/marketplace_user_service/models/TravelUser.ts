import { BaseDdbModel } from 'common-models';

export enum THEMES_TYPE {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum LANGUAGES_TYPE {
  ENGLISH = 'en',
  VIETNAMESE = 'vi'
}

export enum SexEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserStatusEnum {
  online = 'online',
  offline = 'offline',
  busy = 'busy',
  away = 'away',
  inactive = 'inactive',
}

export interface TravelUser extends BaseDdbModel {
  username: string,
  firstName?: string,
  lastName?: string,
  email: string,
  tenant: string,
  roles: Array<string>,
  //  Used for check role in auto-assignment chat
  roleStr: string,
  address?: string,
  phoneNumber: string,
  avatar?: string,
  settings: {
    language?: LANGUAGES_TYPE,
    theme?: THEMES_TYPE
  },
  // Number of assigned chats
  nacs?: number,
  // Flag to check whether user is in waiting for response chat state
  wct?: boolean,
  sex: SexEnum
  birthday: string,
  status?: UserStatusEnum,
  searchApiKey?: string,
}

export interface UserWithPermission extends TravelUser {
  permissions: Array<string>
}

export interface UserWithRoles extends TravelUser {
  roles: string[],
}
