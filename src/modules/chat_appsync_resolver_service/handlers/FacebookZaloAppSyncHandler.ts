import { ChatPlatform } from 'common-models';
import { AppSyncEvent, Message, UnknownEvent } from '../models';
import { fbMessagePlatformRepository, userRepository, zaloMessagePlatformRepository } from '../repositories';
import { AppSyncHandler } from './AppSyncHandler';

/**
 * This handler temporary is used to handle events related to both Facebook anh Zalo.
 * TODO: It should be rename to BaseAppSyncHandler and create handlers for specific platform
 */
export default class FacebookZaloAppSyncHandler implements AppSyncHandler {
  /**
   * Send message to chat platform
   * @param message Message information
   * @returns Created message returned from chat platform
   */
  sendMessage = async (message: Message) => {
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
  getUserProfile = async (platform: ChatPlatform, pageId: string, pageUserId: string) => {
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
  handle = async (event: AppSyncEvent) => {
    const args = event.arguments; // Args from AppSync
    let resolverMessage: string; // Resolved result as a message
    let returnedData: any; // Resolved data
    // Handle each case of resolver type
    switch (event.field) {
      case 'sendMessage': // TravelOffice user send message from Sales web application. Message will be received from AppSync and send to 3rd-party API
        returnedData = await this.sendMessage(args);
        resolverMessage = 'One message is created by Sales System';
        break;

      case 'allFbConversations': // Fetch conversations information
      {
        const { tenant, username } = event;
        const isRootOrAdmin = await userRepository.isRootOrAdmin(tenant, username);
        const assigned = isRootOrAdmin ? undefined : username;
        returnedData = await fbMessagePlatformRepository.getConversations(
          tenant,
          args.pageId,
          assigned,
        );
        resolverMessage = 'The conversations has been fetched from third-party platform';
        break;
      }

      case 'allFbMessages': // Fetch messages when opening Sales Web or user scroll the chat box
        returnedData = await fbMessagePlatformRepository.getMessages(
          args.pageId,
          args.conversationId,
          args.after,
          args.limit,
        );
        resolverMessage = 'The messages has been fetched from third-party platform';
        break;

      case 'allZaloConversations':
        returnedData = await zaloMessagePlatformRepository.getConversations(
          args.pageId,
          args.offset,
          args.count,
        );
        resolverMessage = 'The conversations has been fetched from Zalo platform';
        break;

      case 'allZaloMessages':
        returnedData = await zaloMessagePlatformRepository.getMessages(
          args.pageId,
          args.userId,
          args.offset,
          args.count,
        );
        resolverMessage = 'The message has been fetched from Zalo platform';
        break;

      case 'userProfile':
        returnedData = await this.getUserProfile(
          args.platform,
          args.pageId,
          args.pageUserId,
        );
        resolverMessage = `User profile has been fetched from ${args.platform} platform`;
        break;

      default:
        throw new Error(`Unknown field, unable to resolve ${(event as UnknownEvent).field}`);
    }
    return {
      message: resolverMessage,
      data: returnedData,
    };
  };
}
