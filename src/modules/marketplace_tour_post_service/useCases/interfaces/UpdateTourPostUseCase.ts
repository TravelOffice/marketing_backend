import { TourPost } from '../../models/TourPost';
import { UpdateTourPostDto } from '../../dto/UpdateTourPostDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface UpdateTourPostUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
    updateTourPostDto: UpdateTourPostDto,
  ): Promise<TourPost>,
}
