import { CognitoUser } from '../../models/CognitoUser';

export interface UnfollowTourPostUseCase {
  invoke(currentUser: CognitoUser, tourPostId: string): Promise<void>,
}
