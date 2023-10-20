import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { CreateUserNotificationDto, UserNotification } from '../../models/UserNotification';
import { AppType } from '../../models/UserDeviceSession';

export interface UserNotificationRepository {
  listByUser: (
    currentUserId: string, // Combine tenant and username
    type: AppType,
    paginationParams: PaginationParams, // Pagination settings
  ) => Promise<PaginationResponsePayload<UserNotification> | undefined>,

  getLatestTimeMarkAllRead: (
    currentUserId: string,
    appType: AppType,
  ) => Promise<number | undefined>,

  sendToTopic: (
    topic: string,
    appType: AppType,
    createUserNotificationDto: CreateUserNotificationDto,
  ) => Promise<void>

  markAllRead: (
    currentUserId: string,
    appType: AppType,
    markedTime: number,
  ) => Promise<void>

  martAsRead: (
    currentUserid: string,
    appType: AppType,
    notificationId: string
  ) => Promise<void>
}
