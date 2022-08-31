import { NotificationEvent } from './models/NotificationEvent';
import { NotificationType } from './models/NotificationType';
import { notificationRepository } from './repositories';
import logger from './utils/logger';

/**
 * Handler for notification service
 * @param event Invocation event
 * @param context Invocation context
 */
export const handler = async (event: NotificationEvent) => {
  try {
    logger.log(`Received notification event ${JSON.stringify(event, null, 3)}`);
    const { type, data } = event;
    switch (type) {
      case NotificationType.EMAIL: {
        const {
          fromAddress, toAddresses, ccAddresses, html, text, subject,
        } = data;
        const returnedData = await notificationRepository.sendEmail(
          fromAddress,
          toAddresses,
          ccAddresses,
          html,
          text,
          subject,
        );
        logger.log(`A notification has been sent with data ${JSON.stringify(data, null, 2)}, result is ${JSON.stringify(returnedData, null, 3)}`);
        return returnedData;
      }

      case NotificationType.APPSYNC: {
        const {
          tenant, username, type: notificationType, timestamp, data: notificationData,
        } = data;
        const returnedData = await notificationRepository.sendAppSyncNotification(
          notificationType,
          JSON.stringify(notificationData),
          timestamp,
          tenant,
          username,
        );
        logger.log(`An AppSync notification has been sent with data ${JSON.stringify(data, null, 2)}, result is ${JSON.stringify(returnedData, null, 3)}`);
        return returnedData;
      }

      default:
        throw new Error(`Notification type ${type} is not supported yet.`);
    }
  } catch (error: any) {
    logger.log(`Generated an error: ${error.message}`);
  }
  return {};
};
