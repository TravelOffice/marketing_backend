import { CognitoUser } from '../../models/CognitoUser';

export interface SubscribeToTopicUseCase {
  invoke(
    currentUser: CognitoUser,
    topic: string,
  ): Promise<void>,
}
