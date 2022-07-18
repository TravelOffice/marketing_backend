import AWS from 'aws';
import { ChatPlatform } from 'common-models';
import { AppSyncEvent, Message, UnknownEvent } from './models';
import { fbMessagePlatformRepository, zaloMessagePlatformRepository } from './repositories';
import { TELEGRAM_SERVICE_NAME } from './utils/environments';

const lambda = new AWS.Lambda();

/**
 * Send message to chat platform
 * @param message Message information
 * @returns Created message returned from chat platform
 */
const sendMessage = async (message: Message) => {
  switch (message.chatPlatform) {
    case ChatPlatform.facebook:
      return fbMessagePlatformRepository.sendMessage(message);
    case ChatPlatform.zalo:
      return zaloMessagePlatformRepository.sendMessage(message);
    default:
      throw new Error(`Chat platform ${message.chatPlatform} is not supported`);
  }
};

/**
 * Get user profile information
 * @param platform Chat platform
 * @param pageId Page id
 * @param pageUserId User id
 * @returns User profile information
 */
const getUserProfile = async (platform: ChatPlatform, pageId: string, pageUserId: string) => {
  switch (platform) {
    case ChatPlatform.facebook:
      return fbMessagePlatformRepository.getUserProfile(pageId, pageUserId);
    case ChatPlatform.zalo:
      return {};
    default:
      throw new Error(`Chat platform ${platform} is not supported`);
  }
};

/**
 * Handle all the AppSync event for both Facebook and Zalo platform
 * @param event AppSync event payload
 * @returns Data from chat platform
 */
const handleFbZaloAppSyncEvent = async (event: AppSyncEvent) => {
  const args = event.arguments; // Args from AppSync
  let resolverMessage: string; // Resolved result as a message
  let returnedData: any; // Resolved data
  // Handle each case of resolver type
  switch (event.field) {
    case 'sendMessage': // TravelOffice user send message from Sales web application. Message will be received from AppSync and send to 3rd-party API
      returnedData = await sendMessage(event.arguments);
      resolverMessage = 'One message is created by Sales System';
      break;

    case 'receivedMessage':
      // Customer send message from social platform
      // or Sales user send message to customer from Sales web / message platform.
      // Then, webhook api received new message and call AppSync `receivedMessage` directly.
      resolverMessage = 'One message is received by Sales Webhook and passthrough to AppSync';
      returnedData = args;
      break;

    case 'allFbConversations': // Fetch conversations information
      returnedData = await fbMessagePlatformRepository.getConversations(event.arguments.pageId);
      resolverMessage = 'The conversations has been fetched from third-party platform';
      break;

    case 'allFbMessages': // Fetch messages when opening Sales Web or user scroll the chat box
      returnedData = await fbMessagePlatformRepository.getMessages(
        event.arguments.pageId,
        event.arguments.conversationId,
        event.arguments.after,
        event.arguments.limit,
      );
      resolverMessage = 'The messages has been fetched from third-party platform';
      break;

    case 'allZaloConversations':
      returnedData = await zaloMessagePlatformRepository.getConversations(
        event.arguments.pageId,
        event.arguments.offset,
        event.arguments.count,
      );
      resolverMessage = 'The conversations has been fetched from Zalo platform';
      break;

    case 'allZaloMessages':
      returnedData = await zaloMessagePlatformRepository.getMessages(
        event.arguments.pageId,
        event.arguments.userId,
        event.arguments.offset,
        event.arguments.count,
      );
      resolverMessage = 'The message has been fetched from Zalo platform';
      break;

    case 'userProfile':
      returnedData = await getUserProfile(
        event.arguments.platform,
        event.arguments.pageId,
        event.arguments.pageUserId,
      );
      resolverMessage = `User profile has been fetched from ${event.arguments.platform} platform`;
      break;

    default:
      throw new Error(`Unknown field, unable to resolve ${(event as UnknownEvent).field}`);
  }
  return {
    message: resolverMessage,
    data: returnedData,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AppSyncEvent) => {
  const eventField = event.field;
  const { chatPlatform } = event.arguments;

  // Check whether platform is telegram
  // Force `allTelegramConversations`, `allTelegramMessages` as telegram event
  const isTelegramEvent = eventField.startsWith('allTelegram') || chatPlatform === ChatPlatform.telegram;
  if (isTelegramEvent) {
    // Invoke `telegram_platform_service` service to get the data from Telegram
    const invokeParams: AWS.Lambda.Types.InvocationRequest = {
      FunctionName: TELEGRAM_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(event),
    };
    const { Payload: payloadString } = await lambda.invoke(invokeParams).promise();
    if (payloadString && typeof payloadString === 'string') {
      return JSON.parse(payloadString);
    }
    throw new Error('Unable to read payload returned from invocation');
  } else {
    return handleFbZaloAppSyncEvent(event);
  }
};
