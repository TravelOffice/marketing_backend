import { UserDeviceSession } from '../../models/UserDeviceSession';

export interface UserDeviceSessionRepository {
  create: (
    tenant: string,
    username: string,
    creatingSession: UserDeviceSession,
  ) => Promise<UserDeviceSession | undefined>,

  listByUser: (
    tenant: string,
    username: string,
  ) => Promise<UserDeviceSession[]>,

  getByDeviceToken: (
    tenant: string,
    username: string,
    token: string,
  ) => Promise<UserDeviceSession | undefined>,
}
