import { getAwsSecretValue } from 'get-env';
import AWS from 'aws';
import { AppSyncSendMessageData, ChatPlatform, DDBConversation } from 'common-models';
import omit from 'lodash/omit';
import * as crypto from 'crypto';
import amrToMp3 from 'amrToMp3';
import path from 'path';
import fs from 'fs';
import {
  SendMessageMutationArgs,
  SendZaloMessageResponsePayload,
  toSendZaloMessagePayload,
  ZaloMessageResponsePayload,
} from '../models';
import { dynamoProvider, s3Provider, zaloMessagePlatformProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  CREATED_TIME_INDEX,
  FILE_INDEX,
  MESSAGE_INDEX,
  OMITTED_CONVERSATION_ATTRIBUTES,
  PAGINATION_LIMIT,
  PARTITION_KEY_DELIMITER,
  TEMPORARY_MESSAGE_INDEX,
  TENANT_INDEX,
  ZALO_PAGE_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { ZaloMessagePlatformRepository } from './interfaces/ZaloMessagePlatformRepository';

type DDBUpdateItemInput = AWS.DynamoDB.DocumentClient.UpdateItemInput;

export default class ZaloMessagePlatformRepositoryImpl implements ZaloMessagePlatformRepository {
  /**
   * Get Zalo access token stored in DynamoDB
   * @param pageId Page id
   * @returns Zalo access token
   */
  private readonly getZaloMessagePlatformToken = async (pageId: string): Promise<string> => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params = {
      TableName: travelTable,
      IndexName: 'PageIdIndex',
      KeyConditionExpression: '#pageId = :id',
      ExpressionAttributeNames: {
        '#pageId': 'id',
        '#sk': 'sk',
      },
      // Filter the item startwith `PAGE#ZALO#` to make sure the item is Zalo token
      // Prevent the same token with other providers such as Facebook, Telegram
      FilterExpression: 'begins_with(#sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        // Given page id
        ':id': pageId,
        // Prefix to Zalo item
        ':sk_filter_value': ZALO_PAGE_INDEX,
      },
      ProjectionExpression: 'pk,sk,accessToken,refreshToken,id,expireIn',
    };
    const rs = await dynamoProvider.query(params);
    if (rs.Items && rs.Items?.length > 0) {
      const dynamoItem = rs.Items[0];
      logger.log('[ZaloMessagePlatformRepositoryImpl.getZaloMessagePlatformToken] DynamoDB item', dynamoItem);
      if (dynamoItem.accessTokenExpireIn > Date.now()) {
        return dynamoItem.accessToken;
      }
      if (dynamoItem.refreshTokenExpireIn < Date.now()) {
        throw new Error('Refresh token is expired');
      }
      const refreshTokenResponse = await zaloMessagePlatformProvider.refreshToken(
        dynamoItem.refreshToken,
      );
      if (refreshTokenResponse) {
        const expireIn = new Date(Date.now() + refreshTokenResponse.expires_in * 1000);
        const updateParams: DDBUpdateItemInput = {
          TableName: travelTable,
          Key: {
            pk: dynamoItem.pk, // pk and sk can be unmarshall
            sk: dynamoItem.sk,
          },
          UpdateExpression: 'set accessToken = :at, refreshToken= :rt, expireIn = :ei',
          ExpressionAttributeValues: {
            ':at': refreshTokenResponse.access_token,
            ':rt': refreshTokenResponse.refresh_token,
            ':ei': expireIn.getTime(),
          },
          ReturnValues: 'UPDATED_NEW',
        };
        const updatedRs = await dynamoProvider.update(updateParams);
        if (updatedRs) {
          return refreshTokenResponse.access_token;
        }
      }
    }
    throw new Error(`Can not get token for Zalo page with id ${pageId}`);
  };

  /**
   * Send message to customer from Zalo OA
   * @param message Message data
   */
  sendMessage = async (
    tenantId: string,
    message: SendMessageMutationArgs,
  ): Promise<SendZaloMessageResponsePayload> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageId = message.sender;
      const pageToken = await this.getZaloMessagePlatformToken(pageId);
      // Send message
      const payload = toSendZaloMessagePayload(message);
      const sendResponse = await zaloMessagePlatformProvider.sendMessage(pageToken, payload);
      /**
       * Save the temporary metadata of this message to database to mark message
       * sent by webhook later. Data will visible only 3 minutes
      */
      const ttl = Math.floor(Date.now() / 1000) + 3 * 60;
      const travelTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
      const zaloPlatformStr = ChatPlatform.zalo.toUpperCase(); // Platform unique code
      const pk = `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${zaloPlatformStr}#${pageId}`;
      const sk = `${CONVERSATION_INDEX}#${message.recipient}#${TEMPORARY_MESSAGE_INDEX}#${sendResponse.data.message_id}`;

      await dynamoProvider.put(travelTable, pk, sk, {
        metadata: (message.messageData as AppSyncSendMessageData).metadata,
        ttl,
      });

      return sendResponse;
    } catch (error) {
      logger.log(`[ZaloMessagePlatformRepositoryImpl.sendMessage] Generated an error ${error}`);
      throw error;
    }
  };

  /**
   * Get Zalo conversation from dynamodb
   * @param tenantId Tenant ID
   * @param pageId Zalo Page ID
   * @param assigneeId Assigned employee ID
   * @returns ZaloMessageResponsePayload
   */
  getConversations = async (
    tenantId: string,
    pageId: string,
    assigneeId?: string,
  ): Promise<ZaloMessageResponsePayload | undefined> => {
    const travelTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const zaloPlatformStr = ChatPlatform.zalo.toUpperCase(); // Platform unique code
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
        ':pk': `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${zaloPlatformStr}#${pageId}`,
        ':lsi_filter_value': assigneeIndex,
      },
    };

    const { Items: items } = await dynamoProvider.query(params) as { Items: DDBConversation[] };
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
        `[ZaloMessagePlatformRepositoryImpl.getConversations] Conversations of page ${pageId}`,
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
      } as ZaloMessageResponsePayload;
    }
    return undefined;
  };

  /**
   * Method to get conversation messages
   * @param tenantId The id of the Tenant which the user should belong to
   * @param botId The id of telegram bot
   * @param chatId The id of the conversation
   * @param nextToken The token to get next paging item
   * @param limit The page size
   * @returns Promise<ZaloMessageResponsePayload> All messages of the conversation
   */
  getConversationMessages = async (
    tenantId: string,
    pageId: string,
    userId: string,
    nextToken?: string,
    limit?: number,
  ) => {
    try {
      const dynamoTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
      const paginationLimit = limit || PAGINATION_LIMIT;
      const platformStr = ChatPlatform.zalo.toUpperCase();
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
          ':lsi_filter_value': `${CONVERSATION_INDEX}#${userId}#${CREATED_TIME_INDEX}`,
        },
        ScanIndexForward: false, // Sort descending
        Limit: paginationLimit,
        ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
      };
      const { LastEvaluatedKey, Items: messageItems } = await dynamoProvider.rawQuery(params);
      if (messageItems) {
        return {
          data: messageItems.map((message: any) => {
            const {
              sk, pk, lsi1, lsi2, lsi3, lsi4, lsi5, ...rest
            } = message;
            return {
              content: rest.content,
            };
          }),
          paging: {
            cursors: {
              before: LastEvaluatedKey ? JSON.stringify(LastEvaluatedKey) : '',
              after: nextToken || '',
            },
          },
        } as ZaloMessageResponsePayload;
      }
      return {
        data: [],
        paging: {
          cursors: {
            before: '',
            after: '',
          },
        },
      } as ZaloMessageResponsePayload;
    } catch (error) {
      logger.log(`[ZaloMessagePlatformRepositoryImpl.getMessages] Generated an error ${error}`);
      throw error;
    }
  };

  /**
   * Convert Zalo audio to MP3 file
   * @param fileUrl Zalo arm file path
   * @param fileName output file name
   * @returns
   */
  convertArmToMp3 = async (
    filePath: string,
    fileName: string,
  ): Promise<string> => {
    const randomByteLength = 16;
    const outputFolderName = crypto.randomBytes(randomByteLength).toString('hex');
    // In lambda we using the tmp folder to save the temporary file
    const outputFolderPath = path.join('/tmp/', outputFolderName);
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }
    return amrToMp3(filePath, outputFolderPath, fileName);
  };

  /**
   * Get Zalo audio file
   * @param tenantId tenant id
   * @param pageId Page id
   * @param userId Conversation id
   * @param messageId Message id of the audio file
   * @param fileUrl Zalo audio url file
   * @returns
   */
  getZaloAudio = async (
    tenantId: string,
    pageId: string,
    conversationId: string,
    messageId: string,
    fileUrl: string,
  ): Promise<ZaloMessageResponsePayload | undefined> => {
    try {
      const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
      const zaloPlatformStr = ChatPlatform.zalo.toUpperCase();
      const chatFileBucketUrl = await getAwsSecretValue('CHAT_FILE_CDN');
      const filePk = `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${conversationId}#${zaloPlatformStr}#${pageId}`;
      const fileSk = `${FILE_INDEX}#${messageId}`;

      // Get the file information from database
      const item = await dynamoProvider.get(table, filePk, fileSk);

      if (item) {
        const {
          sk, pk, lsi1, lsi2, lsi3, lsi4, lsi5, ...rest
        } = item;
        const { filePath } = rest;
        return {
          data: `${chatFileBucketUrl}/${filePath}`,
        } as ZaloMessageResponsePayload;
      }

      // Convert arm to mp3
      const outputFileName = `${fileUrl.substring(fileUrl.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '')}.mp3`;
      const chatFileBucket = await getAwsSecretValue('CHAT_FILE_BUCKET');

      // Dowload arm file to local storage
      const armFilePath = await s3Provider.downloadFileFromCDN(fileUrl);
      const mp3FilePath = await this.convertArmToMp3(armFilePath, outputFileName);

      const filePath = await s3Provider.saveFile(
        chatFileBucket,
        `${tenantId}/${messageId}/${outputFileName}`,
        mp3FilePath,
      );

      await dynamoProvider.put(table, filePk, fileSk, { filePath });
      return {
        data: `${chatFileBucketUrl}/${filePath}`,
      } as ZaloMessageResponsePayload;
    } catch (error) {
      logger.log(`[ZaloMessagePlatformRepositoryImpl.getZaloAudio] Generated an error ${error}`);
      throw error;
    }
  };
}
