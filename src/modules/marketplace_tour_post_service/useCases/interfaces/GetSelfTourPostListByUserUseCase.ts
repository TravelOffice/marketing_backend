import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';

export interface GetSelfTourPostListByUserUseCase {
  invoke(
    currentUser: CognitoUser,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
