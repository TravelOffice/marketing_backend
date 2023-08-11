import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { TourPost } from '../../models/TourPost';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetTourPostListUseCase {
  invoke(
    user: CognitoUser,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
