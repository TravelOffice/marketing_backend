import { UserDeviceSession } from '../UserDeviceSession';

export type CreateUserDeviceSessionDto = Pick<
  UserDeviceSession,
  'type' | 'token' | 'name' | 'userAgent' | 'os' | 'appType'
>;
