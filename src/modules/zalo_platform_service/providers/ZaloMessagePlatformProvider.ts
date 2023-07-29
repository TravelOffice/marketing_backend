import axios, { AxiosInstance } from 'axios';
import { getAwsSecretValue } from 'get-env';
import {
  SendZaloMessageRequestPayload,
  SendZaloMessageResponsePayload,
  ZaloMessageResponsePayload,
  ZaloRefreshTokenResponsePayload,
} from '../models';
import logger from '../utils/logger';

export default class ZaloMessagePlatformProvider {
  private readonly messagePlatformV2BaseUrl: string = 'https://openapi.zalo.me/v2.0';

  /**
   * Zalo OpenAPI v3 is the latest version of the API and now supported the sendMessage operation.
   * It introduces new features, and Zalo will continuously migrate APIs from v2 to v3 soon.
   */
  private readonly messagePlatformV3BaseUrl: string = 'https://openapi.zalo.me/v3.0';

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
   * Send message from page admin to customer
   * @param pageToken Page token stored in DynamoDB table
   * @param messagePayload Message content.
   *  In the future, others message type will be supported such as image | video | url
   * @returns void
   */
  sendMessage = async (
    pageToken: string,
    messagePayload: SendZaloMessageRequestPayload,
  ): Promise<SendZaloMessageResponsePayload> => {
    const response = await this.axiosInstance.post(
      `${this.messagePlatformV3BaseUrl}/oa/message/cs`,
      messagePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          access_token: pageToken,
        },
      },
    );
    if (response.data.error === 0) {
      logger.log(
        `[ZaloMessagePlatformProvider.sendMessage] The message from page ${pageToken} has been sent, response message from Message Platform`,
        response.data,
      );
      return response.data;
    }
    throw new Error(response.data.message);
  };

  /**
   * Get conversations list of given page
   * @param pageId Id of Zalo page
   * @param offset Offset of conversations is list
   * @param count Number of conversations that want to be returned
   * @returns List of conversations
   */
  getConversations = async (
    pageToken: string,
    offset: number = 0,
    count: number = 10,
  ): Promise<ZaloMessageResponsePayload> => {
    const response = await this.axiosInstance.get(
      `${this.messagePlatformV2BaseUrl}/oa/listrecentchat`,
      {
        headers: {
          access_token: pageToken,
        },
        params: {
          data: {
            offset,
            count,
          },
        },
      },
    );
    if (response.data.error === 0) {
      logger.log(
        '[ZaloMessagePlatformProvider.getConversations] Get conversations successfully:',
        response.data,
      );
      return response.data;
    }
    throw new Error(response.data.message);
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
      `${this.messagePlatformV2BaseUrl}/oa/conversation`,
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
      return {
        ...response.data,
        paging: {
          cursors: {
            before: offset.toString(),
            after: (offset + count).toString(),
          },
        },
      };
    }
    throw new Error(response.data.message);
  };
}
