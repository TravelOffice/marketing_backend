import axios, { AxiosInstance } from 'axios';
import { getAwsSecretValue } from 'get-env';
import {
  SendZaloMessageRequestPayload,
  ZaloMessageResponsePayload,
  ZaloRefreshTokenResponsePayload,
} from '../models';

export default class ZaloMessagePlatformProvider {
  private _messagePlatformBaseUrl: string = 'https://openapi.zalo.me/v2.0';
  private _oauthBaseUrl: string = 'https://oauth.zaloapp.com/v4';
  private _messagePlatformRequestTimeout: number = 15000;
  private _axiosInstance: AxiosInstance;

  /**
   * Constructor, init http client to communicate Fb Message Platform APIs
   */
  constructor() {
    this._axiosInstance = axios.create({
      timeout: this._messagePlatformRequestTimeout, // Milliseconds
    });
  }
  
  refreshToken = async (resfreshToken: string): Promise<ZaloRefreshTokenResponsePayload> => {
    const appSecretKey = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_SECRET_KEY');
    const appId = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_APP_ID');

    const response = await this._axiosInstance.post(
      `${this._oauthBaseUrl}/oa/access_token`,
      null,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'secret_key': appSecretKey
        },
        params: {
          'app_id': appId,
          'grant_type': 'refresh_token',
          'refresh_token': resfreshToken
        }
      }
    );
    if (response.data.error) {
      throw new Error(response.data.error_name);
    } else {
      console.info(
        `[ZaloMessagePlatformProvider.refreshToken] Refresh token successfully:`, response.data);
      return response.data;
    }
  }

  /**
   * Send message from page admin to customer
   * @param pageToken Page token stored in DynamoDB table
   * @param messagePayload Message content. In the future, others message type will be supported such as image | video | url
   * @returns void
   */
  sendMessage = async (pageToken: string, messagePayload: SendZaloMessageRequestPayload): Promise<void> => {
    const response = await this._axiosInstance.post(
      `${this._messagePlatformBaseUrl}/oa/messages`,
      messagePayload,
      {
        'headers': {
          'Content-Type': 'application/json',
          'access_token': pageToken
        }
      }
    );
    if (response.data.error === 0) {
      console.info(
        `[ZaloMessagePlatformProvider.sendMessage] The message from page ${pageToken} has been sent, response message from Message Platform`,
        response.data
      );  
    } else {
      throw new Error(response.data.message);
    }
  }

  /**
   * Get conversations list of given page
   * @param pageId Id of Zalo page
   * @param offset Offset of conversations is list
   * @param count Number of conversations that want to be returned
   * @returns List of conversations
   */
  getConversations = async (pageToken: string, offset: number = 0, count: number = 10): Promise<ZaloMessageResponsePayload> => {
    const response = await this._axiosInstance.get(
      `${this._messagePlatformBaseUrl}/oa/listrecentchat`,
      {
        headers: {
          'access_token': pageToken
        },
        params: {
          data: {
            'offset': offset,
            'count': count
          }
        }
      }
    );
    if (response.data.error === 0) {
      console.info(
        `[ZaloMessagePlatformProvider.getConversations] Get conversations successfully:`,
        response.data
      );
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  };

  /**
   * Get messages of given conversation
   * @param userId User id
   * @param offset Offset of messages is list
   * @param count Number of messages that want to be returned
   * @returns List of messages with this user id
   */
  getMessages = async (pageToken: string, userId: string, offset: number = 0, count: number = 10): Promise<ZaloMessageResponsePayload> => {
    const response = await this._axiosInstance.get(
      `${this._messagePlatformBaseUrl}/oa/conversation`,
      {
        headers: {
          'access_token': pageToken
        },
        params: {
          data: {
            'user_id': userId,
            'offset': offset,
            'count': count
          }
        }
      }
    );
    if (response.data.error === 0) {
      console.info(
        `[ZaloMessagePlatformProvider.getMessages] Return messages of user ${userId} with data`,
        response.data
      );
      return response.data;  
    } else {
      throw new Error(response.data.message);
    }
  };
}
