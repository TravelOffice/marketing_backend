import { PostRating } from '../../models/PostRating';

export interface GetPostRatingListUseCase {
  invoke(
    organization: string,
    tourPostId: string,
  ): Promise<PostRating[]>,
}
