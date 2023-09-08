import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';
import { TourPostType } from '../../models/TourPostType';

export interface GetTourPostListByPostTypeUseCase {
  invoke(
    currentUser: CognitoUser,
    postType: TourPostType,
    params: PaginationParams,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
