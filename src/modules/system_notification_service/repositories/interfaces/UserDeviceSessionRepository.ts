import { UserDeviceSession } from '../../models/UserDeviceSession';

export interface UserDeviceSessionRepository {
  create: (
    userId: string,
    creatingSession: UserDeviceSession,
  ) => Promise<UserDeviceSession | undefined>,

  listByUser: (
    userId: string,
  ) => Promise<UserDeviceSession[]>,

  getByDeviceToken: (
    userId: string,
    token: string,
  ) => Promise<UserDeviceSession | undefined>,
}
