import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';

export interface GetTourPostUseCase {
  invoke(tourPostId: string, currentUser: CognitoUser): Promise<TourPost>,
}
