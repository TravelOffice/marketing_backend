import { Message, toSendFbMessagePayload, FacebookMessageResponsePayload } from '../models';
import { dynamoProvider, fbMessagePlatformProvider } from '../providers';
import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';

export default class FbMessagePlatformRepositoryImpl implements FbMessagePlatformRepository {
  /**
   * Get Facebook access token stored in DynamoDB
   * @param pageId Page id
   * @returns Facebook access token
   */
  _getFbMessagePlatformToken = async (pageId: string): Promise<string> => {
    const params = {
      TableName: 'SalesChat',
      Key: {
        pageId: pageId
      },
      ProjectionExpression: 'fbAccessToken',
    };
    const rs =  await dynamoProvider.getItem(params);
    if (!rs.Item) {
      throw new Error(`Can not get token for Facebook page with id ${pageId}`);
    }

    console.info('[FbMessagePlatformRepositoryImpl._getFbMessagePlatformToken] DynamoDB item', rs.Item);
    return rs.Item.fbAccessToken;
  }

  /**
   * Send message to customer from Fb page
   * @param message Message data
   */
  sendMessage = async (message: Message): Promise<any> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this._getFbMessagePlatformToken(message.sender);
      // Send message
      const payload = toSendFbMessagePayload(message);
      return fbMessagePlatformProvider.sendMessage(pageToken, payload);
    } catch (error) {
      console.log(`[FbMessagePlatformRepositoryImpl.sendMessage] Generated an error`, error);
      throw error;
    }
  };

  /**
   * Get conversations for page
   * @param pageId Page id
   * @returns
   */
  getConversations = async (pageId: string): Promise<FacebookMessageResponsePayload | undefined> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this._getFbMessagePlatformToken(pageId);
      return fbMessagePlatformProvider.getConversations(pageToken, pageId);
    } catch (error) {
      console.log(`[FbMessagePlatformRepositoryImpl.getConversations] Generated an error`, error);
    }
  };

  /**
   * Get messages for given conversation id
   * @param senderAsPageId Page id
   * @param conversationId Conversation id
   * @param before Before token for paging
   * @returns
   */
  getMessages = async (senderAsPageId: string, conversationId: string, before?: string): Promise<FacebookMessageResponsePayload | undefined> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this._getFbMessagePlatformToken(senderAsPageId);
      return fbMessagePlatformProvider.getMessages(pageToken, conversationId, before);
    } catch (error) {
      console.log(`[FbMessagePlatformRepositoryImpl.getMessages] Generated an error`, error);
    }
  };
}
