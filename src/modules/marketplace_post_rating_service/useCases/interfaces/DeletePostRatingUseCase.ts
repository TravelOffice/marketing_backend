import { CognitoUser } from '../../models/CognitoUser';

export interface DeletePostRatingUseCase {
  invoke(
    currentUser: CognitoUser,
    organizationId: string,
    tourPostId: string,
    postRatingId: string
  ): Promise<void>,
}
