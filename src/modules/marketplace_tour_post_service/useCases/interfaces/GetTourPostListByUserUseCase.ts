import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { TourPost } from '../../models/TourPost';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetTourPostListByUserUseCase {
  invoke(
    currentUser: CognitoUser,
    author: string,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
