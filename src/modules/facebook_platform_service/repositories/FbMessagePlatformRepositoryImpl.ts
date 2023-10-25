import { ChatPlatform, DDBConversation } from 'common-models';
import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import omit from 'lodash/omit';
import {
  FacebookMessageResponsePayload,
  FacebookUserProfile,
  SendMessageMutationArgs,
  toSendFbMessagePayload,
} from '../models';
import { fbMessagePlatformProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  CREATED_TIME_INDEX,
  FACEBOK_PAGE_INDEX,
  MESSAGE_INDEX,
  OMITTED_CONVERSATION_ATTRIBUTES,
  PARTITION_KEY_DELIMITER,
  TENANT_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';

export default class FbMessagePlatformRepositoryImpl implements FbMessagePlatformRepository {
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
      IndexName: 'Index1',
      KeyConditionExpression: '#pk = :pk AND begins_with ( #lsi, :lsi_filter_value )',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#lsi': 'lsi1',
      },
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${facebookPlatformStr}#${pageId}`,
        ':lsi_filter_value': assigneeIndex,
      },
    };

    const items: DDBConversation[] = await dynamoProvider.query(params);
    if (items) {
      const conversations = items.map(
        (conversation) => {
          const { lsi1, sk } = conversation;
          const [, conversationId] = sk.split(PARTITION_KEY_DELIMITER);
          const restrictedConversation = omit(conversation, OMITTED_CONVERSATION_ATTRIBUTES);
          if (lsi1) {
            const [, assignee] = lsi1.split(PARTITION_KEY_DELIMITER);
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
   * Method to get conversation messages
   * @param tenantId The id of tenant
   * @param pageId The id of Facebook page
   * @param conversationId The id of the conversation
   * @param nextToken The token to get next paging item
   * @param limit The page size
   * @returns Promise<FacebookMessageResponsePayload> All messages of the conversation
   */
  getConversationMessages = async (
    tenantId: string,
    pageId: string,
    conversationId: string,
    nextToken?: string,
    limit?: number,
  ) => {
    try {
      const dynamoTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
      const platformStr = ChatPlatform.facebook.toUpperCase();
      const params = {
        TableName: dynamoTable,
        IndexName: 'Index2',
        KeyConditionExpression: '#pk = :pk AND begins_with ( #lsi, :lsi_filter_value )',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#lsi': 'lsi2',
        },
        ExpressionAttributeValues: {
          ':pk': `${TENANT_INDEX}#${tenantId}#${MESSAGE_INDEX}#${platformStr}#${pageId}`,
          ':lsi_filter_value': `${CONVERSATION_INDEX}#${conversationId}#${CREATED_TIME_INDEX}`,
        },
      };

      const queryResult = await dynamoProvider.queryPagination(params, {
        limit,
        nextToken,
      });
      if (queryResult) {
        return {
          ...queryResult,
          data: queryResult.data.map((item) => (
            {
              content: item.content,
            })),
        } as FacebookMessageResponsePayload;
      }
      return {
        data: [],
        paging: {
          cursors: {
            before: '',
            after: '',
          },
        },
      } as FacebookMessageResponsePayload;
    } catch (error) {
      logger.log(`[FbMessagePlatformRepositoryImpl.getMessages] Generated an error ${error}`);
      throw error;
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
      // Filter the item start with `PAGE#FACEBOOK#` to make sure the item is facebook token
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
    const items = await dynamoProvider.query(params);
    if (items && items?.length > 0) {
      logger.log('[FbMessagePlatformRepositoryImpl.getFbMessagePlatformToken] DynamoDB item:', items[0]);
      return items[0].accessToken;
    }
    throw new Error(`Can not get token for Facebook page with id ${pageId}`);
  };
}
