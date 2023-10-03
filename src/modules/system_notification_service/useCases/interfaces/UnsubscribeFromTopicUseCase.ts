import { CognitoUser } from '../../models/CognitoUser';

export interface UnsubscribeFromTopicUseCase {
  invoke(
    currentUser: CognitoUser,
    topic: string,
  ): Promise<void>,
}
