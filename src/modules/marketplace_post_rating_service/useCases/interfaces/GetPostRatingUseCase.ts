import { PostRating } from '../../models/PostRating';

export interface GetPostRatingUseCase {
  invoke(tourPostId: string, ratingId: string): Promise<PostRating | undefined>,
}
