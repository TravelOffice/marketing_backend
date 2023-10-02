import { SubscribedUser } from '../../models/SubscribedUser';

export interface SubscribedUserRepository {
  create: (subscribedUser: SubscribedUser) => Promise<SubscribedUser>,

  listByTopic: (
    topic: string,
  ) => Promise<SubscribedUser[]>,

  delete: (
    subscribedUser: SubscribedUser,
  ) => Promise<void>,
}
