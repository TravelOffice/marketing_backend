import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { GetPostRatingListUseCase } from './interfaces/GetPostRatingListUseCase';
import { PostRatingResponsePayload } from '../models/PostRating';
import { postRatingRepository } from '../repositories';

export default class GetPostRatingListUseCaseImpl implements GetPostRatingListUseCase {
  /**
   * Retrieves the list rating of tour post by the associated tour post ID.
   *
   * @param tourPostId
   * @param paginationParams
   * @returns A Promise that resolves to an array of ratings.
   */
  invoke = async (
    tourPostId: string,
    paginationParams: PaginationParams,
  ): Promise<PostRatingResponsePayload | undefined> => postRatingRepository.listByPost(
    tourPostId,
    paginationParams,
  );
}
