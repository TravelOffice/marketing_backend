import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../../models/CognitoUser';
import { TourPost } from '../../models/TourPost';
import { TourPostStatus } from '../../models/TourPostStatus';

export interface GetPostsByEndingLocationUseCase {
  invoke(
    currentUser: CognitoUser,
    endingLocation: string,
    params: PaginationParams,
    status?: TourPostStatus,
  ): Promise<PaginationResponsePayload<TourPost> | undefined>,
}
