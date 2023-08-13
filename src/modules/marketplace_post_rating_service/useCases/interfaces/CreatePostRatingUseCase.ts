import { PostRating } from '../../models/PostRating';
import { CreatePostRatingDto } from '../../dto/CreatePostRatingDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface CreatePostRatingUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
    createRatingDto: CreatePostRatingDto,
  ): Promise<PostRating>,
}
