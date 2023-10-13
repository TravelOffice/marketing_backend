import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../../models/CognitoUser';
import { UserNotification } from '../../models/UserNotification';
import { AppType } from '../../models/UserDeviceSession';

export interface GetUserNotificationsUseCase {
  invoke(
    currentUser: CognitoUser,
    appType: AppType,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<UserNotification> | undefined>,
}
