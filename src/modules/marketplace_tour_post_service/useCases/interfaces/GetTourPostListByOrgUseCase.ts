import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';
import { TourPostStatus } from '../../models/TourPostStatus';

export interface GetTourPostListByOrgUseCase {
  invoke(
    currentUser: CognitoUser,
    organization: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
