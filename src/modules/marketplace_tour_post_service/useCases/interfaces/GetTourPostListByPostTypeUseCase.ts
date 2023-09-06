import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';

export interface GetTourPostListByPostTypeUseCase {
  invoke(
    currentUser: CognitoUser,
    author: string,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
