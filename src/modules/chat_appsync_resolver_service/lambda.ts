import { fbMessagePlatformRepository } from './repositories';

type AppSyncEvent = {
  field: string,
  arguments: any,
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AppSyncEvent) => {
  const args = event.arguments; // Args from AppSync
  let resolverMessage: string; // Resolved result as a message
  let returnedData: any; // Resolved data
  // Handle each case of resolver type
  switch (event.field) {
    case 'sendMessage': // TravelOffice user send message from Sales web application. Message will be received from AppSync and send to 3rd-party API
      returnedData = await fbMessagePlatformRepository.sendMessage(args);
      resolverMessage = 'One message is created by Sales System';
      break;

    case 'receivedMessage':
      // Customer send message from social platform or Sales user send message to customer from Sales web / message platform.
      // Then, webhook api received new message and call AppSync `receivedMessage` directly.
      resolverMessage = 'One message is received by Sales Webhook and passthrough to AppSync';
      returnedData = args;
      break;

    case 'allConversations': // Fetch conversations information
      returnedData = await fbMessagePlatformRepository.getConversations(args.pageId);
      resolverMessage = 'The conversations has been fetched from third-party platform';
      console.log(returnedData);
      break;

    case 'allMessages': // Fetch messages when opening Sales Web or user scroll the chat box
      returnedData = await fbMessagePlatformRepository.getMessages(args.pageId, args.conversationId, args.before);
      resolverMessage = 'The messages has been fetched from third-party platform';
      break;

    default:
      throw new Error(`Unknown field, unable to resolve ${event.field}`);
  }
  return {
    message: resolverMessage,
    data: returnedData
  }
};
