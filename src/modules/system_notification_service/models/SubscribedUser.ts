import { BaseDdbModel } from 'common-models';

export interface SubscribedUser extends BaseDdbModel {
  userId: string,
  topic: string,
}
