import { PostRating } from '../../models/PostRating';

export interface GetPostRatingListUseCase {
  invoke(
    organizationId: string,
    tourPostId: string,
  ): Promise<PostRating[]>,
}
