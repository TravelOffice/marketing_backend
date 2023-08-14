import { GetPostRatingListUseCase } from './interfaces/GetPostRatingListUseCase';
import { PostRating } from '../models/PostRating';
import { postRatingRepository } from '../repositories';

export default class GetPostRatingListUseCaseImpl implements GetPostRatingListUseCase {
  /**
   * Retrieves the list rating of tour post by the associated tour post ID.
   *
   * @param organizationId
   * @param tourPostId
   * @returns A Promise that resolves to an array of ratings.
   */
  invoke = async (
    organizationId: string,
    tourPostId: string,
  ): Promise<PostRating[]> => postRatingRepository.listByPost(organizationId, tourPostId);
}
