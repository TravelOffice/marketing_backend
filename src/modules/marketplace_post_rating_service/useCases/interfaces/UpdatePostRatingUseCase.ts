import { PostRating } from '../../models/PostRating';
import { UpdatePostRatingDto } from '../../dto/UpdatePostRatingDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface UpdatePostRatingUseCase {
  invoke(
    currentUser: CognitoUser,
    updateRatingDto: UpdatePostRatingDto,
  ): Promise<PostRating>,
}
