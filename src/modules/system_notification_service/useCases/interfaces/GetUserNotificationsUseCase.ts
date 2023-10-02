import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../../models/CognitoUser';
import { UserNotification } from '../../models/UserNotification';

export interface GetUserNotificationsUseCase {
  invoke(
    currentUser: CognitoUser,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<UserNotification> | undefined>,
}
