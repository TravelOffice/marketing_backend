import {
  ChatPlatform,
  ChatPlatformFile,
  ChatPlatformStrings,
  TelegramUser as User,
  UserProfilePhotos,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import {
  RestrictedTelegramConversation,
  RestrictedTelegramFile,
  RestrictedTelegramMessage,
  TelegramConversationWithAssignee,
  TelegramPagingMessage,
} from '../models';
import { TelegramSendMessageData } from '../models/send-message/SendMessageData';
import {
  AbstractSendMessageStrategy,
  SendAudioMessageStrategy,
  SendDocumentMessageStrategy,
  SendPhotoMessageStrategy,
  SendTextMessageStrategy,
  SendVideoMessageStrategy,
} from '../patterns/send-message';
import { fileProvider, telegramProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  CREATED_TIME_INDEX,
  FILE_INDEX,
  MESSAGE_INDEX,
  PAGINATION_LIMIT,
  PARTITION_KEY_DELIMITER,
  TELEGRAM_PAGE_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { TelegramPlatformRepository } from './interfaces/TelegramPlatformRepository';

export default class TelegramPlatformRepositoryImpl implements TelegramPlatformRepository {
  /**
   * Method to get chat (aka conversation) information
   * @param tenantId The id of the Tenant which the user should belong to
   * @param botId The id of telegram bot
   * @param chatId The id of the conversation
   * @returns Promise<TelegramConversationWithAssignee> The conversation information with assigneeId
   */
  getChat = async (tenantId: string, botId: string, chatId: string) => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const telegramPlatformStr = ChatPlatform.telegram.toUpperCase();

    const item = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${telegramPlatformStr}#${botId}`,
      `${CONVERSATION_INDEX}#${chatId}`,
    );

    if (!item) throw new Error(`Conversation [${chatId}] not found.`);

    const {
      pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...conversation
    } = item;
    const [, assignee] = lsi1.split(PARTITION_KEY_DELIMITER);
    return {
      ...conversation,
      conversationId: chatId,
      assignee,
    } as TelegramConversationWithAssignee;
  };

  /**
   * Method to get conversation messages
   * @param tenantId The id of the Tenant which the user should belong to
   * @param botId The id of telegram bot
   * @param chatId The id of the conversation
   * @param nextToken The token to get next paging item
   * @param limit The page size
   * @returns Promise<TelegramPagingMessage> All messages of the conversation
   */
  getConversationMessages = async (
    tenantId: string,
    botId: string,
    chatId: string,
    nextToken?: string,
    limit?: number,
  ) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const paginationLimit = limit || PAGINATION_LIMIT;
    const telegramPlatformStr = ChatPlatform.telegram.toUpperCase();
    const params = {
      TableName: dynamoTable,
      IndexName: 'Index2',
      KeyConditionExpression: '#pk = :pk AND begins_with ( #lsi, :lsi_filter_value )',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#lsi': 'lsi2',
      },
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${MESSAGE_INDEX}#${telegramPlatformStr}#${botId}`,
        ':lsi_filter_value': `${CONVERSATION_INDEX}#${chatId}#${CREATED_TIME_INDEX}`,
      },
      ScanIndexForward: false, // Sort descending
    };
    const queryResult = await dynamoProvider.queryPagination(
      params,
      { limit: paginationLimit, nextToken },
    );
    if (queryResult) {
      return {
        nextToken: queryResult.paging.cursors.before,
        messages: queryResult.data.map((message) => ({
          content: message.content,
        } as RestrictedTelegramMessage)),
      } as TelegramPagingMessage;
    }

    return {
      messages: [],
    } as TelegramPagingMessage;
  };

  /**
   * Get user profile information
   * @param tenantId The id of the Tenant
   * @param botId The id of telegram bot
   * @param chatId The id of the conversation
   * @param userId The id of user
   * @returns User information and avatar path
   */
  getUserProfile = async (tenantId: string, botId: string, chatId: string, userId: string) => {
    // Get telegram bot access token
    const accessToken = await this.getAccessToken(botId);
    // Get user information and user avatars
    const { user, avatars } = await telegramProvider.getUserProfile(
      accessToken,
      chatId,
      userId,
    ) as { user: User, avatars: UserProfilePhotos };
    // Get file info from bot api (Params: Avatar file id)
    if (avatars && avatars.total_count > 0) {
      // Telegram stored all the avatars of user
      // In addition, Telegram system treats first avatar as current user avatar
      const { file_id: fileId } = avatars.photos[0][0]; // Get the first size
      const { fileInfo: avatar } = await this.getFileInfo(tenantId, accessToken, chatId, fileId);
      return { ...user, avatar };
    }

    // Also check if user dont have avatar
    return { ...user };
  };

  /**
   * Get chat profile information
   * @param tenantId The id of the Tenant
   * @param botId The id of telegram bot
   * @param chatId The id of the conversation
   * @returns User information and avatar path
   */
  getGroupProfile = async (tenantId: string, botId: string, chatId: string) => {
    // Get telegram bot access token
    const accessToken = await this.getAccessToken(botId);
    // Get chat information
    const chatProfile = await telegramProvider.getChatProfile(
      accessToken,
      chatId,
    );
    const { photo } = chatProfile;
    if (photo) {
      // Telegram stored all the avatars of chat
      // In addition, Telegram system treats smallest avatar as current user avatar
      const { small_file_id: fileId } = photo; // Get the smallest size
      const { fileInfo: avatar } = await this.getFileInfo(tenantId, accessToken, chatId, fileId);
      return { ...chatProfile, avatar };
    }

    // Also check if user dont have avatar
    return { ...chatProfile };
  };

  getConversations = async (tenantId: string, botId: string, assigneeId?: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const telegramPlatformStr: ChatPlatformStrings = 'telegram'; // Platform unique code
    // Combination of ASSIGNEE#<username>
    const assigneeIndex = assigneeId ? `${ASSIGNEE_INDEX}#${assigneeId}` : `${ASSIGNEE_INDEX}#`;

    const params = {
      TableName: dynamoTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi_filter_value)',
      ExpressionAttributeValues: {
        // Combination of TENANT#<tenant_id>#CONVERSATION#<platform>#<id>
        ':pk': `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${telegramPlatformStr.toUpperCase()}#${botId}`,
        ':lsi_filter_value': assigneeIndex,
      },
    };
    const conversationItems = await dynamoProvider.query(params);
    if (conversationItems) {
      return conversationItems.map((conversation) => {
        const {
          sk, pk, lsi1, ...rest
        } = conversation;
        const [, conversationId] = sk.split(PARTITION_KEY_DELIMITER);
        if (lsi1) {
          const [, assignee] = lsi1.split(PARTITION_KEY_DELIMITER);
          return {
            ...rest,
            assignee,
            conversationId,
          } as RestrictedTelegramConversation;
        }
        return {
          ...rest,
          conversationId,
        } as RestrictedTelegramConversation;
      });
    }
    return [];
  };

  getAccessToken = async (botId: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params = {
      TableName: travelTable,
      IndexName: 'PageIdIndex',
      KeyConditionExpression: '#pageId = :id',
      ExpressionAttributeNames: {
        '#pageId': 'id',
        '#sk': 'sk',
      },
      // Filter the item startwith `PAGE#TELEGRAM#` to make sure the item is Telegram token
      // Prevent the same token with other providers such as Zalo, Telegram
      FilterExpression: 'begins_with(#sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        // Given page id
        ':id': botId,
        // Prefix to Telegram item
        ':sk_filter_value': TELEGRAM_PAGE_INDEX,
      },
      ProjectionExpression: 'sk,accessToken,id',
    };

    const items = await dynamoProvider.query(params);
    if (items && items.length > 0) {
      return items[0].accessToken;
    }

    throw new Error(`[TelegramPlatformRepository.getAccessToken] Can't get bot ${botId} token`);
  };

  /**
   * Send text message to Telegram user
   * @param accessToken Telegram access token
   * @param chatId Conversation id stored at DynamoDB
   * @param data Message data to send
   * @returns Message object
   */
  sendMessage = async (
    accessToken: string,
    chatId: string,
    data: TelegramSendMessageData,
  ) => {
    let messageStrategy: AbstractSendMessageStrategy;
    const { messageType } = data;
    // Intialize strategy object for executing send message
    switch (messageType) {
      case 'audio':
        messageStrategy = new SendAudioMessageStrategy(telegramProvider);
        break;

      case 'video':
        messageStrategy = new SendVideoMessageStrategy(telegramProvider);
        break;

      case 'image':
        messageStrategy = new SendPhotoMessageStrategy(telegramProvider);
        break;

      case 'file':
        messageStrategy = new SendDocumentMessageStrategy(telegramProvider);
        break;

      default:
        messageStrategy = new SendTextMessageStrategy(telegramProvider);
        break;
    }
    return messageStrategy.send(accessToken, chatId, data);
  };

  /**
   * Method to save telegram file information to DynamoDB
   * @param tenantId The id of the Tenant
   * @param chatId The id of the conversation
   * @param fileId The telegram file id
   * @param fileInfo The file information
   * @returns Promise<RestrictedTelegramFile> The file information
   */
  saveFileInfo = async (
    tenantId: string,
    chatId: string,
    fileId: string,
    fileInfo: ChatPlatformFile,
  ) => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const telegramPlatformStr = ChatPlatform.telegram.toUpperCase();

    await dynamoProvider.putItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${telegramPlatformStr}#${chatId}`,
      `${FILE_INDEX}#${fileId}`,
      { fileInfo },
    );
    return { fileInfo } as RestrictedTelegramFile;
  };

  /**
   * Method to get telegram file information
   * - Step 1: Check whether file information exists in the database or not
   *     + Get file information from database
   *     + Check whether file id with other conversation have information or not
   * - Step 2: If file not exists, get the original telegram file information
   * - Step 3: Save the file content to S3
   * - Step 4: Save file information to the DynamoDB
   * @param tenantId The id of the Tenant
   * @param accessToken The bot token
   * @param chatId The id of the conversation
   * @param fileId The telegram file id
   * @returns Promise<RestrictedTelegramFile> The file information
   */
  getFileInfo = async (
    tenantId: string,
    accessToken: string,
    chatId: string,
    fileId: string,
  ) => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const telegramPlatformStr = ChatPlatform.telegram.toUpperCase();
    const chatFileBucket = await getAwsSecretValue('CHAT_FILE_BUCKET');
    const chatFileBucketUrl = await getAwsSecretValue('CHAT_FILE_CDN');

    // Get the file information from database
    const item = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${telegramPlatformStr}#${chatId}`,
      `${FILE_INDEX}#${fileId}`,
    );

    if (item) {
      const {
        sk, pk, lsi1, ...rest
      } = item;
      const info = rest as RestrictedTelegramFile;
      info.fileInfo.file_path = `${chatFileBucketUrl}/${info.fileInfo.file_path}`;
      return info;
    }

    // Check whether file id with other conversation have information or not
    const params = {
      TableName: table,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk AND begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':sk': `${FILE_INDEX}#${fileId}`,
        ':pk_filter': `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${telegramPlatformStr}#`,
      },
    };
    const files = await dynamoProvider.query(params);
    if (files?.length > 0) {
      const { fileInfo } = files[0];
      const info = await this.saveFileInfo(tenantId, chatId, fileId, fileInfo);
      info.fileInfo.file_path = `${chatFileBucketUrl}/${info.fileInfo.file_path}`;
      return info;
    }
    // Get the original file information from Telegram CDN
    const originalFile = await telegramProvider.getFile(accessToken, fileId);

    if (!originalFile || !originalFile.file_path) throw new Error(`Cannot get original file ${fileId} from Telegram`);

    // Save file to S3
    const filePath = await fileProvider.downloadFileToS3FromUrl(
      `${chatFileBucket}`,
      `${tenantId}/${fileId}/${originalFile.file_path}`,
      telegramProvider.getFilePath(accessToken, originalFile.file_path),
    );

    const fileInfo: ChatPlatformFile = {
      ...originalFile,
      file_path: filePath,
    };
    const info = await this.saveFileInfo(tenantId, chatId, fileId, fileInfo);
    info.fileInfo.file_path = `${chatFileBucketUrl}/${info.fileInfo.file_path}`;
    return info;
  };
}
