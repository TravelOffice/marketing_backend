import { zaloMessagePlatformRepository } from './repositories';
import logger from './utils/logger';

interface AppSyncEvent {
  field: string,
  tenant: string,
  username: string,
  arguments: any,
}

/**
 * Handle AppSync event such as `sendMessage` `receivedMessage` and so on
 * @param event AppSync event contains request data
 * @returns Data returned from DynamoDB or Telegram platform
 */
const handleAppSyncEvent = async (event: AppSyncEvent) => {
  const args = event.arguments; // Args from AppSync
  const { tenant, username } = event;
  let resolverMessage: string; // Resolved result as a message
  let returnedData: any; // Resolved data
  // Handle each case of resolver type
  switch (event.field) {
    case 'sendMessage': // TravelOffice user send message from Sales web application. Message will be received from AppSync and send to 3rd-party API
      returnedData = await zaloMessagePlatformRepository.sendMessage(
        tenant,
        event.arguments,
      );
      resolverMessage = 'One message is created by Sales System';
      break;

    case 'allZaloConversations':
      // Fetch conversations information
      returnedData = await zaloMessagePlatformRepository.getConversations(
        tenant,
        args.pageId,
        username,
      );
      resolverMessage = 'The conversations has been fetched from Zalo platform';
      break;

    case 'allZaloMessages':
      returnedData = await zaloMessagePlatformRepository.getMessages(
        args.pageId,
        args.conversationId,
        args.offset,
        args.count,
      );
      resolverMessage = 'The message has been fetched from Zalo platform';
      break;

    case 'userProfile':
      returnedData = {};
      resolverMessage = `User profile has been fetched from ${args.platform} platform`;
      break;

    // Fetch conversations information
    case 'adminAllZaloConversations': {
      returnedData = await zaloMessagePlatformRepository.getConversations(
        tenant,
        args.pageId,
      );
      resolverMessage = 'The conversations has been fetched from Zalo platform';
      break;
    }
    case 'getZaloAudio':
      returnedData = await zaloMessagePlatformRepository.getZaloAudio(
        tenant,
        args.pageId,
        args.conversationId,
        args.messageId,
        args.fileUrl,
      );
      resolverMessage = 'The message has been converted from Zalo platform';
      break;
    default: {
      const { field } = event;
      throw new Error(`Unknown field, unable to resolve ${field}`);
    }
  }
  return {
    message: resolverMessage,
    data: returnedData,
  };
};

/**
 * Handler for invocation from AppSync resolver lambda
 * This function handle the event forwarded from AppSync and return data from Telegram platform
 * @param event Invocation event
 * @param context Invocation context
 */
// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AppSyncEvent, context: any) => {
  try {
    logger.log(`Forwarded AppSync event ${JSON.stringify(event)}`);
    return handleAppSyncEvent(event);
  } catch (error) {
    context.fail(error);
    return null;
  }
};
