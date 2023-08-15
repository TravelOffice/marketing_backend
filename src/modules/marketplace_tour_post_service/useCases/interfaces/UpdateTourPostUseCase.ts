import { UpdateTourPostDto } from '../../dto/UpdateTourPostDto';
import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';

export interface UpdateTourPostUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
    updateTourPostDto: UpdateTourPostDto,
  ): Promise<TourPost>,
}
