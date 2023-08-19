import { CognitoUser } from '../../models/CognitoUser';

export interface DeletePostRatingUseCase {
  invoke(
    currentUser: CognitoUser,
    organization: string,
    tourPostId: string,
    postRatingId: string
  ): Promise<void>,
}
