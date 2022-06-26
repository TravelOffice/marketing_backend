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
  role: ROLES_TYPE,
  address?: string,
  phoneNumber: string,
  avatar?: string,
  settings: {
    language?: LANGUAGES_TYPE,
    theme?: THEMES_TYPE
  },
  createdAt: number,
  updatedAt: number,
}
