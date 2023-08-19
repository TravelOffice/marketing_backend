import { PostRating } from '../../models/PostRating';

export interface GetPostRatingUseCase {
  invoke(
    organization: string,
    tourPostId: string,
    ratingId: string,
  ): Promise<PostRating | undefined>,
}
