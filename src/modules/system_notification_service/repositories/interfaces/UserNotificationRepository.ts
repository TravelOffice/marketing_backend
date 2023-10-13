import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CreateUserNotificationDto, UserNotification } from '../../models/UserNotification';
import { AppType } from '../../models/UserDeviceSession';

export interface UserNotificationRepository {
  listByUser: (
    currentUserId: string, // Combine tenant and username
    type: AppType,
    paginationParams: PaginationParams, // Pagination settings
  ) => Promise<PaginationResponsePayload<UserNotification> | undefined>,

  sendToTopic(
    topic: string,
    appType: AppType,
    createUserNotificationDto: CreateUserNotificationDto,
  ): Promise<void>
}
