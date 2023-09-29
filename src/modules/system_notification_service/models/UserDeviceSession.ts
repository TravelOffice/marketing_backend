import { BaseDdbModel } from 'common-models';

export enum DeviceTypeEnum {
  MOBILE_IOS = 'MOBILE_IOS',
  MOBILE_ANDROID = 'MOBILE_ANDROID',
  BROWSER = 'BROWSER',
}

export type DeviceType = keyof typeof DeviceTypeEnum;

export interface UserDeviceSession extends BaseDdbModel {
  type: DeviceType,
  token: string,
  name: string,
  userAgent: string,
  os: string,
}

export const deviceTypes = Object.keys(DeviceTypeEnum) as Array<DeviceType>;
