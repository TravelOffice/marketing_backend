import { NotificationType } from './models/NotificationType';
import { notificationRepository } from './repositories';
import logger from './utils/logger';

export interface SendNotificationEvent {
  type: NotificationType,
  data: {
    fromAddress: string,
    toAddresses: string[],
    ccAddresses: string[],
    subject: string,
    html: string,
    text: string,
  }
}

/**
 * Handler for notification service
 * @param event Invocation event
 * @param context Invocation context
 */
export const handler = async (event: SendNotificationEvent) => {
  try {
    logger.log(`Received event ${event}`);
    const { type, data } = event;
    switch (type) {
      case NotificationType.EMAIL: {
        const {
          fromAddress, toAddresses, ccAddresses, html, text, subject,
        } = data;
        return notificationRepository.sendEmail(
          fromAddress,
          toAddresses,
          ccAddresses,
          html,
          text,
          subject,
        );
      }

      default:
        throw new Error(`Notification type ${type} is not supported yet.`);
    }
  } catch (error: any) {
    logger.log(`Generated an error: ${error.message}`);
  }
  return {};
};
