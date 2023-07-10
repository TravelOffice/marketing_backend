import { CognitoUser } from '../../models/CognitoUser';

export interface DeleteSourceUseCase {
  invoke(currentUser: CognitoUser, sourceId: string): Promise<void>,
}
