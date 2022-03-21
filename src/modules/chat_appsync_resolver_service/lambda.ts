import { fbMessagePlatformRepository, zaloMessagePlatformRepository } from './repositories';
import { AppSyncEvent, Message } from './models';
import { ChatPlatform } from 'common-models';

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AppSyncEvent) => {
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
      // Customer send message from social platform or Sales user send message to customer from Sales web / message platform.
      // Then, webhook api received new message and call AppSync `receivedMessage` directly.
      resolverMessage = 'One message is received by Sales Webhook and passthrough to AppSync';
      returnedData = args;
      break;

    case 'allFbConversations': // Fetch conversations information
      returnedData = await fbMessagePlatformRepository.getConversations(event.arguments.pageId);
      resolverMessage = 'The conversations has been fetched from third-party platform';
      break;

    case 'allFbMessages': // Fetch messages when opening Sales Web or user scroll the chat box
      returnedData = await fbMessagePlatformRepository.getMessages(event.arguments.pageId, event.arguments.conversationId, event.arguments.after, event.arguments.limit);
      resolverMessage = 'The messages has been fetched from third-party platform';
      break;

    case 'allZaloConversations':
      returnedData = await zaloMessagePlatformRepository.getConversations(event.arguments.pageId, event.arguments.offset, event.arguments.count);
      resolverMessage = 'The conversations has been fetched from Zalo platform';
      break;

    case 'allZaloMessages':
      returnedData = await zaloMessagePlatformRepository.getMessages(event.arguments.pageId, event.arguments.userId, event.arguments.offset, event.arguments.count);
      resolverMessage = 'The message has been fetched from Zalo platform';
      break;

    default:
      throw new Error(`Unknown field, unable to resolve ${event['field']}`);
  }
  return {
    message: resolverMessage,
    data: returnedData
  }
};

const sendMessage = async (message: Message) => {
  switch (message.chatPlatform) {
    case ChatPlatform.facebook:
      return fbMessagePlatformRepository.sendMessage(message);
    case ChatPlatform.zalo:
      return zaloMessagePlatformRepository.sendMessage(message);
    default:
      throw new Error(`Chat platform ${message.chatPlatform} is not supported`);
  }
}
