import {
  adminGetTelegramConversationsUseCase,
  getFileInfoUseCase,
  getTelegramConversationsUseCase,
  getTelegramMessagesUseCase,
  sendMessageUseCase,
  getTelegramUserProfileUseCase,
} from './usecases';
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
  const { field } = event;
  let resolverMessage: string; // Resolved result as a message
  let returnedData: any; // Resolved data
  switch (field) {
    case 'allTelegramConversations': {
      const conversations = await getTelegramConversationsUseCase.invoke(
        event.tenant,
        event.arguments.pageId,
        event.username,
      );
      resolverMessage = 'The conversations has been fetched from Telegram platform';
      returnedData = conversations;
      logger.log(`Fetched conversations for user ${event.tenant}#${event.username} ${JSON.stringify(conversations, null, 2)}`);
      break;
    }
    case 'allTelegramMessages': {
      const messages = await getTelegramMessagesUseCase.invoke(
        event.tenant,
        event.username,
        event.arguments.pageId,
        event.arguments.conversationId,
        event.arguments.nextToken,
        event.arguments.limit,
      );
      resolverMessage = 'The messages has been fetched from Telegram platform';
      returnedData = messages;
      logger.log(`Fetched messages for user ${event.tenant}#${event.username}: ConversationId ${event.arguments.conversationId} ${JSON.stringify(messages, null, 2)}`);
      break;
    }
    case 'sendMessage': {
      const sentMessage = await sendMessageUseCase.invoke(
        event.tenant,
        event.username,
        event.arguments.sender,
        event.arguments.recipient,
        event.arguments.messageData,
      );
      resolverMessage = 'The message has been sent from Telegram bot';
      returnedData = undefined;
      logger.log(`Sent message successfully: ${JSON.stringify(sentMessage, null, 2)}`);
      break;
    }
    case 'getTelegramFileInfo': {
      logger.log(`Receive getTelegramFileInfo event ${event}`);
      const fileInfo = await getFileInfoUseCase.invoke(
        event.tenant,
        event.arguments.pageId,
        event.arguments.conversationId,
        event.arguments.fileId,
      );
      resolverMessage = 'The file information has been fetched from Telegram platform';
      returnedData = fileInfo;
      logger.log(`Fetched file for [${event.tenant}#${event.arguments.conversationId}]: successfully: ${JSON.stringify(returnedData, null, 2)}`);
      break;
    }
    case 'adminAllTelegramConversations': {
      const conversations = await adminGetTelegramConversationsUseCase.invoke(
        event.tenant,
        event.arguments.pageId,
      );
      resolverMessage = 'The conversations has been fetched from Telegram platform';
      returnedData = conversations;
      logger.log(`Fetched conversations for admin ${JSON.stringify(conversations, null, 2)}`);
      break;
    }
    case 'userProfile': {
      logger.log(`Receive getTelegramUserProfile event ${event}`);
      const { pageId: botId, pageUserId: userId, chatId } = event.arguments;
      const userProfile = await getTelegramUserProfileUseCase.invoke(
        event.tenant,
        botId,
        chatId,
        userId,
      );
      resolverMessage = 'The user profile information has been fetched from Telegram platform';
      returnedData = userProfile;
      logger.log(`Fetched user profile for [${event.tenant}#${userId}]: successfully: ${JSON.stringify(returnedData, null, 2)}`);
      break;
    }
    default:
      throw new Error(`Event field ${field} is not supported yet.`);
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
