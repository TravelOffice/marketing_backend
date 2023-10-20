import { SubscribedUser } from '../../models/SubscribedUser';

export interface SubscribedUserRepository {
  create: (
    topic: string,
    userId: string,
    deviceTokens: string[]
  ) => Promise<void>,

  listByUser: (
    userId: string,
  ) => Promise<SubscribedUser[]>,

  listByTopic: (
    topic: string,
  ) => Promise<SubscribedUser[]>,

  delete: (
    topic: string,
    userId: string,
    deviceTokens: string[],
  ) => Promise<void>,
}
