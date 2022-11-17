import { fbMessagePlatformRepository } from './repositories';
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
  let resolverMessage: string; // Resolved result as a message
  let returnedData: any; // Resolved data
  // Handle each case of resolver type
  switch (event.field) {
    case 'sendMessage': // TravelOffice user send message from Sales web application. Message will be received from AppSync and send to 3rd-party API
      returnedData = await fbMessagePlatformRepository.sendMessage(event.arguments);
      resolverMessage = 'One message is created by Sales System';
      break;

    case 'allFbConversations': {
      // Fetch conversations information
      const { tenant, username } = event;
      returnedData = await fbMessagePlatformRepository.getConversations(
        tenant,
        args.pageId,
        username,
      );
      resolverMessage = 'The conversations has been fetched from third-party platform';
      break;
    }

    case 'allFbMessages': {
      // Fetch messages when opening Sales Web or user scroll the chat box
      returnedData = await fbMessagePlatformRepository.getMessages(
        args.pageId,
        args.conversationId,
        args.after,
        args.limit,
      );
      resolverMessage = 'The messages has been fetched from Facebook platform';
      break;
    }

    case 'userProfile': {
      returnedData = await fbMessagePlatformRepository.getUserProfile(
        args.pageId,
        args.pageUserId,
      );
      resolverMessage = `User profile has been fetched from ${args.platform} platform`;
      break;
    }

    // Fetch conversations information
    case 'adminAllFbConversations': {
      const { tenant } = event;
      returnedData = await fbMessagePlatformRepository.getConversations(
        tenant,
        args.pageId,
      );
      resolverMessage = 'The conversations has been fetched from Facebook platform';
      break;
    }

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
