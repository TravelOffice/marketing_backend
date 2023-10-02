import {
  PaginationParams,
  PaginationResponsePayload,
} from 'core/providers/dynamodb/DynamoProvider';
import { UserNotification } from '../../models/UserNotification';

export interface UserNotificationRepository {
  listByUser: (
    currentUserId: string, // Combine tenant and username
    paginationParams: PaginationParams, // Pagination settings
  ) => Promise<PaginationResponsePayload<UserNotification> | undefined>,
}
