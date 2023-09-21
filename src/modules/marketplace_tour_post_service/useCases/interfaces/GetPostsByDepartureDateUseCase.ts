import { PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { TourPost } from '../../models/TourPost';
import { GetPostsByDepartureDateParams } from '../../repositories/interfaces/TourPostRepository';

export interface GetPostsByDepartureDateUseCase {
  invoke(
    params: GetPostsByDepartureDateParams
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
