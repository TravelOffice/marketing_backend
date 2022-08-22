export enum THEMES_TYPE {
  DARK = 'dark',
  LIGHT = 'light'
}
export enum LANGUAGES_TYPE {
  ENGLISH = 'en',
  VIETNAMESE = 'vi'
}
export enum ROLES_TYPE {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  username: string,
  firstName?: string,
  lastName?: string,
  email: string,
  tenant: string,
  roles: Array<string>,
  address?: string,
  phoneNumber: string,
  avatar?: string,
  settings: {
    language?: LANGUAGES_TYPE,
    theme?: THEMES_TYPE
  },
  createdAt: number,
  updatedAt: number,
  // Number of assigned chats
  nacs?: number,
  // Flag to check whether user is in waiting for response chat state
  wct?: boolean,
}

export interface UserWithPermission extends User {
  permissions: Array<string>
}
