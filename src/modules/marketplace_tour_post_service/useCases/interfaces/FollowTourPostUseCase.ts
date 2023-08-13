import { CognitoUser } from '../../models/CognitoUser';
import { FollowedTourPost } from '../../models/FollowedTourPost';

export interface FollowTourPostUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
  ): Promise<Partial<FollowedTourPost> | undefined>,
}
