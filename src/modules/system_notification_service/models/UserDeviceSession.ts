import { BaseDdbModel } from 'common-models';

export enum DeviceTypeEnum {
  MOBILE_IOS = 'MOBILE_IOS',
  MOBILE_ANDROID = 'MOBILE_ANDROID',
  BROWSER = 'BROWSER',
}

export enum AppTypeEnum {
  TRAVEL = 'TRAVEL',
  MARKETPLACE = 'MARKETPLACE',
}

export type DeviceType = keyof typeof DeviceTypeEnum;
export const deviceTypes = Object.keys(DeviceTypeEnum) as Array<DeviceType>;
export type AppType = keyof typeof AppTypeEnum;
export const appTypes = Object.keys(AppTypeEnum) as Array<AppType>;

export interface UserDeviceSession extends BaseDdbModel {
  type: DeviceType,
  token: string,
  name: string,
  userAgent: string,
  os: string,
  appType: AppType,
}
