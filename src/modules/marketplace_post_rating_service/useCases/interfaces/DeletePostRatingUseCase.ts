import { CognitoUser } from '../../models/CognitoUser';

export interface DeletePostRatingUseCase {
  invoke(currentUser: CognitoUser, tourPostId: string, postRatingId: string): Promise<void>,
}
