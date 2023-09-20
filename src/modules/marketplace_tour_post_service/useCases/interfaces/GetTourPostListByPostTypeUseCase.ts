import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';
import { TourPostType } from '../../models/TourPostType';
import { TourPostStatus } from '../../models/TourPostStatus';

export interface GetTourPostListByPostTypeUseCase {
  invoke(
    currentUser: CognitoUser,
    postType: TourPostType,
    params: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
