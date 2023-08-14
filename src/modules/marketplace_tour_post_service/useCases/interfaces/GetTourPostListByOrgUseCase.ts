import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { TourPost } from '../../models/TourPost';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetTourPostListByOrgUseCase {
  invoke(
    currentUser: CognitoUser,
    organization: string,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
