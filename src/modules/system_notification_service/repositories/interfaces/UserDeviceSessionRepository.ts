import { AppType, UserDeviceSession } from '../../models/UserDeviceSession';

export interface UserDeviceSessionRepository {
  create: (
    userId: string,
    appType: AppType,
    creatingSession: UserDeviceSession,
  ) => Promise<UserDeviceSession | undefined>,

  listByUser: (
    userId: string,
    appType: AppType,
  ) => Promise<UserDeviceSession[]>,

  getByDeviceToken: (
    userId: string,
    appType: AppType,
    token: string,
  ) => Promise<UserDeviceSession | undefined>,
}
