import { PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { TourPost } from '../../models/TourPost';
import { GetPostsByEndingLocationParams } from '../../repositories/interfaces/TourPostRepository';

export interface GetPostsByEndingLocationUseCase {
  invoke(
    params: GetPostsByEndingLocationParams
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
