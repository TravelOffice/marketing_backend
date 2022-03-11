import { getAwsSecretValue } from 'get-env';
import { Message, toSendZaloMessagePayload, ZaloMessageResponsePayload } from '../models';
import { dynamoProvider, zaloMessagePlatformProvider } from '../providers';
import { ZaloMessagePlatformRepository } from './interfaces/ZaloMessagePlatformRepository';

export default class ZaloMessagePlatformRepositoryImpl implements ZaloMessagePlatformRepository {
  /**
   * Get Zalo access token stored in DynamoDB
   * @param pageId Page id
   * @returns Zalo access token
   */
  _getZaloMessagePlatformToken = async (pageId: string): Promise<string> => {
    const saleChatTable = await getAwsSecretValue('SALE_CHAT_TABLE');
    const params = {
      TableName: saleChatTable,
      IndexName: 'PageIdIndex',
      KeyConditionExpression: '#pageId = :id',
      ExpressionAttributeNames: {
        '#pageId': 'id',
        '#sk': 'sk',
      },
      // Filter the item startwith `PAGE_fb_` to make sure the item is Zalo token
      // Prevent the same token with other providers such as Zalo, Telegram
      FilterExpression: 'begins_with(#sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        // Given page id
        ':id': pageId,
        // Prefix to Zalo item
        ':sk_filter_value': 'PAGE_zalo_',
      },
      ProjectionExpression: 'sk,accessToken,id',
    };
    const rs = await dynamoProvider.query(params);
    if (rs.Items && rs.Items?.length > 0) {
      console.info('[ZaloMessagePlatformRepositoryImpl._getFbMessagePlatformToken] DynamoDB item', rs.Items[0]);
      return rs.Items[0].accessToken;
    }
    throw new Error(`Can not get token for Zalo page with id ${pageId}`);
  }

  /**
   * Send message to customer from Fb page
   * @param message Message data
   */
  sendMessage = async (message: Message): Promise<any> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this._getZaloMessagePlatformToken(message.sender);
      // Send message
      const payload = toSendZaloMessagePayload(message);
      return zaloMessagePlatformProvider.sendMessage(pageToken, payload);
    } catch (error) {
      console.log(`[ZaloMessagePlatformRepositoryImpl.sendMessage] Generated an error`, error);
      throw error;
    }
  };

  /**
   * Get conversations for page
   * @param pageId Page id
   * @returns
   */
  getConversations = async (pageId: string, offset?: number, count?: number): Promise<ZaloMessageResponsePayload | undefined> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this._getZaloMessagePlatformToken(pageId);
      return zaloMessagePlatformProvider.getConversations(pageToken, offset, count);
    } catch (error) {
      console.log(`[FbMessagePlatformRepositoryImpl.getConversations] Generated an error`, error);
    }
  };

  /**
   * Get messages for given conversation id
   * @param pageId Page id
   * @param userId Conversation id
   * @param before Before token for paging
   * @returns
   */
  getMessages = async (pageId: string, userId: string, offset?: number, count?: number): Promise<ZaloMessageResponsePayload | undefined> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this._getZaloMessagePlatformToken(pageId);
      return zaloMessagePlatformProvider.getMessages(pageToken, userId, offset, count);
    } catch (error) {
      console.log(`[FbMessagePlatformRepositoryImpl.getMessages] Generated an error`, error);
    }
  };
}
