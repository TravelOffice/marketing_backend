import axios, { AxiosInstance } from 'axios';
import { ZaloConversation } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { ZaloMessageResponsePayload } from '../models/ZaloMessageResponsePayload';
import { ZaloRefreshTokenResponsePayload } from '../models/ZaloRefreshTokenResponsePayload';
import logger from '../utils/logger';

export default class ZaloMessagePlatformProvider {
  private readonly messagePlatformBaseUrl: string = 'https://openapi.zalo.me/v2.0';

  private readonly oauthBaseUrl: string = 'https://oauth.zaloapp.com/v4';

  private readonly messagePlatformRequestTimeout: number = 15000;

  private readonly axiosInstance: AxiosInstance;

  /**
   * Constructor, init http client to communicate Fb Message Platform APIs
   */
  constructor() {
    this.axiosInstance = axios.create({
      timeout: this.messagePlatformRequestTimeout, // Milliseconds
    });
  }

  refreshToken = async (resfreshToken: string): Promise<ZaloRefreshTokenResponsePayload> => {
    const appSecretKey = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_SECRET_KEY');
    const appId = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_APP_ID');

    const response = await this.axiosInstance.post(
      `${this.oauthBaseUrl}/oa/access_token`,
      null,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          secret_key: appSecretKey,
        },
        params: {
          app_id: appId,
          grant_type: 'refresh_token',
          refresh_token: resfreshToken,
        },
      },
    );
    if (response.data.error) {
      throw new Error(response.data.error_name);
    } else {
      logger.log('[ZaloMessagePlatformProvider.refreshToken] Refresh token successfully:', response.data);
      return response.data;
    }
  };

  /**
   * Get conversation information of given page
   * @param pageId Id of Zalo page
   * @param conversationId Id of conversation
   * @returns Conversation information
   */
  getConversation = async (
    pageToken: string,
    conversationId: string,
  ): Promise<ZaloConversation> => {
    // Get the last message of the conversation to get the conversation information
    const lastMessage = await this.getMessages(pageToken, conversationId, 0, 1);
    const message = lastMessage.data[0];
    if (message.from_id === conversationId) {
      // Message come from user
      return {
        id: conversationId,
        name: message.from_display_name,
        avatar: message.from_avatar,
      };
    }
    return {
      id: conversationId,
      name: message.to_display_name,
      avatar: message.to_avatar,
    };
  };

  /**
   * Get messages of given conversation
   * @param userId User id
   * @param offset Offset of messages is list
   * @param count Number of messages that want to be returned
   * @returns List of messages with this user id
   */
  getMessages = async (
    pageToken: string,
    userId: string,
    offset: number = 0,
    count: number = 10,
  ): Promise<ZaloMessageResponsePayload> => {
    const response = await this.axiosInstance.get(
      `${this.messagePlatformBaseUrl}/oa/conversation`,
      {
        headers: {
          access_token: pageToken,
        },
        params: {
          data: {
            user_id: userId,
            offset,
            count,
          },
        },
      },
    );
    if (response.data.error === 0) {
      logger.log(
        `[ZaloMessagePlatformProvider.getMessages] Return messages of user ${userId} with data`,
        response.data,
      );
      return response.data;
    }
    throw new Error(response.data.message);
  };
}
