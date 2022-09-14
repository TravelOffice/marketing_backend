import { ChatPlatform, DDBConversation } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import omit from 'lodash/omit';
import {
  FacebookMessageResponsePayload,
  FacebookUserProfile,
  SendMessageMutationArgs,
  toSendFbMessagePayload,
} from '../models';
import { dynamoProvider, fbMessagePlatformProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  FACEBOK_PAGE_INDEX,
  OMITTED_CONVERSATION_ATTRIBUTES,
  PARTITION_KEY_DELIMITER,
  TENANT_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';

export default class FbMessagePlatformRepositoryImpl implements FbMessagePlatformRepository {
  /**
   * Get Facebook access token stored in DynamoDB
   * @param pageId Page id
   * @returns Facebook access token
   */
  private readonly getFbMessagePlatformToken = async (pageId: string): Promise<string> => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params = {
      TableName: travelTable,
      IndexName: 'PageIdIndex',
      KeyConditionExpression: '#pageId = :id',
      ExpressionAttributeNames: {
        '#pageId': 'id',
        '#sk': 'sk',
      },
      // Filter the item startwith `PAGE#FACEBOOK#` to make sure the item is facebook token
      // Prevent the same token with other providers such as Zalo, Telegram
      FilterExpression: 'begins_with(#sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        // Given page id
        ':id': pageId,
        // Prefix to Facebook item
        ':sk_filter_value': FACEBOK_PAGE_INDEX,
      },
      ProjectionExpression: 'sk,accessToken,id',
    };
    const rs = await dynamoProvider.query(params);
    if (rs.Items && rs.Items?.length > 0) {
      logger.log('[FbMessagePlatformRepositoryImpl.getFbMessagePlatformToken] DynamoDB item', rs.Items[0]);
      return rs.Items[0].accessToken;
    }
    throw new Error(`Can not get token for Facebook page with id ${pageId}`);
  };

  /**
   * Send message to customer from Fb page
   * @param message Message data
   */
  sendMessage = async (message: SendMessageMutationArgs): Promise<any> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this.getFbMessagePlatformToken(message.sender);
      // Send message
      const payload = toSendFbMessagePayload(message);
      return fbMessagePlatformProvider.sendMessage(pageToken, payload);
    } catch (error) {
      logger.log(`[FbMessagePlatformRepositoryImpl.sendMessage] Generated an error ${error}`);
      return undefined;
    }
  };

  /**
   * Get conversations for page
   * @param tenantId The Tenant ID
   * @param pageId Page id
   * @param assigneeId Employee id assigned to conversations
   * @returns
   */
  getConversations = async (
    tenantId: string,
    pageId: string,
    assigneeId?: string,
  ): Promise<FacebookMessageResponsePayload | undefined> => {
    const travelTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const facebookPlatformStr = ChatPlatform.facebook.toUpperCase(); // Platform unique code
    // Combination of ASSIGNEE#<username>
    const assigneeIndex = assigneeId ? `${ASSIGNEE_INDEX}#${assigneeId}` : `${ASSIGNEE_INDEX}#`;
    const params = {
      TableName: travelTable,
      IndexName: 'TypeIndex',
      KeyConditionExpression: '#pk = :pk AND begins_with ( #lsi, :lsi_filter_value )',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#lsi': 'typeLsi',
      },
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${facebookPlatformStr}#${pageId}`,
        ':lsi_filter_value': assigneeIndex,
      },
    };

    const { Items: items } = await dynamoProvider.query(params) as { Items: DDBConversation[] };
    if (items) {
      const conversations = items.map(
        (conversation) => {
          const { typeLsi, sk } = conversation;
          const [, conversationId] = sk.split(PARTITION_KEY_DELIMITER);
          const restrictedConversation = omit(conversation, OMITTED_CONVERSATION_ATTRIBUTES);
          if (typeLsi) {
            const [, assignee] = typeLsi.split(PARTITION_KEY_DELIMITER);
            return {
              ...restrictedConversation,
              assignee,
              conversationId,
            };
          }
          return {
            ...restrictedConversation,
            conversationId,
          };
        },
      );
      logger.log(
        `[FbMessagePlatformRepositoryImpl.getConversations] Conversations of page ${pageId}`,
        JSON.stringify(conversations, null, 2),
      );
      return {
        data: conversations,
        paging: {
          cursors: {
            before: '',
            after: '',
          },
        },
      } as FacebookMessageResponsePayload;
    }
    return undefined;
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
      logger.log(`[FbMessagePlatformRepositoryImpl.getMessages] Generated an error ${error}`);
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
      logger.log(`[FbMessagePlatformRepositoryImpl.getUserProfile] Generated an error ${error}`);
      return undefined;
    }
  };
}
