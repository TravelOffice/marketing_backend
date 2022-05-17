import { getAwsSecretValue } from 'get-env';
import {
  FacebookMessageResponsePayload, FacebookUserProfile, Message, toSendFbMessagePayload,
} from '../models';
import { dynamoProvider, fbMessagePlatformProvider } from '../providers';
import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';

export default class FbMessagePlatformRepositoryImpl implements FbMessagePlatformRepository {
  /**
   * Get Facebook access token stored in DynamoDB
   * @param pageId Page id
   * @returns Facebook access token
   */
  private readonly getFbMessagePlatformToken = async (pageId: string): Promise<string> => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params = {
      TableName: saleChatTable,
      IndexName: 'PageIdIndex',
      KeyConditionExpression: '#pageId = :id',
      ExpressionAttributeNames: {
        '#pageId': 'id',
        '#sk': 'sk',
      },
      // Filter the item startwith `PAGE_fb_` to make sure the item is facebook token
      // Prevent the same token with other providers such as Zalo, Telegram
      FilterExpression: 'begins_with(#sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        // Given page id
        ':id': pageId,
        // Prefix to Facebook item
        ':sk_filter_value': 'PAGE_fb_',
      },
      ProjectionExpression: 'sk,accessToken,id',
    };
    const rs = await dynamoProvider.query(params);
    if (rs.Items && rs.Items?.length > 0) {
      console.info('[FbMessagePlatformRepositoryImpl.getFbMessagePlatformToken] DynamoDB item', rs.Items[0]);
      return rs.Items[0].accessToken;
    }
    throw new Error(`Can not get token for Facebook page with id ${pageId}`);
  };

  /**
   * Send message to customer from Fb page
   * @param message Message data
   */
  sendMessage = async (message: Message): Promise<any> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this.getFbMessagePlatformToken(message.sender);
      // Send message
      const payload = toSendFbMessagePayload(message);
      return fbMessagePlatformProvider.sendMessage(pageToken, payload);
    } catch (error) {
      console.log('[FbMessagePlatformRepositoryImpl.sendMessage] Generated an error', error);
      return undefined;
    }
  };

  /**
   * Get conversations for page
   * @param pageId Page id
   * @returns
   */
  getConversations = async (
    pageId: string,
  ): Promise<FacebookMessageResponsePayload | undefined> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this.getFbMessagePlatformToken(pageId);
      return fbMessagePlatformProvider.getConversations(pageToken, pageId);
    } catch (error) {
      console.log('[FbMessagePlatformRepositoryImpl.getConversations] Generated an error', error);
      return undefined;
    }
  };

  /**
   * Get messages for given conversation id
   * @param senderAsPageId Page id
   * @param conversationId Conversation id
   * @param before Before token for paging
   * @param limit Number of items returned from fb api
   * @returns
   */
  getMessages = async (
    senderAsPageId: string,
    conversationId: string,
    after?: string,
    limit?: number,
  ): Promise<FacebookMessageResponsePayload | undefined> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this.getFbMessagePlatformToken(senderAsPageId);
      return fbMessagePlatformProvider.getMessages(pageToken, conversationId, after, limit);
    } catch (error) {
      console.log('[FbMessagePlatformRepositoryImpl.getMessages] Generated an error', error);
      return undefined;
    }
  };

  /**
   * Get Facebook user profile information
   * @param pageId Page id
   * @param userId User id
   * @returns User profile information
   */
  getUserProfile = async (
    pageId: string,
    userId: string,
  ): Promise<FacebookUserProfile | undefined> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this.getFbMessagePlatformToken(pageId);
      return fbMessagePlatformProvider.getUserProfile(pageToken, userId);
    } catch (error) {
      console.log('[FbMessagePlatformRepositoryImpl.getUserProfile] Generated an error', error);
      return undefined;
    }
  };
}
