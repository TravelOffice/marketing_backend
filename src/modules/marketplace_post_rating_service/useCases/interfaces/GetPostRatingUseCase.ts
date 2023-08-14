import { PostRating } from '../../models/PostRating';

export interface GetPostRatingUseCase {
  invoke(
    organizationId: string,
    tourPostId: string,
    ratingId: string,
  ): Promise<PostRating | undefined>,
}
