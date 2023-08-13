import { CognitoUser } from '../../models/CognitoUser';

export interface UnbookmarkTourPostUseCase {
  invoke(currentUser: CognitoUser, tourPostId: string): Promise<void>,
}
