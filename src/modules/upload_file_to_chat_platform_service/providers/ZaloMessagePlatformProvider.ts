import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { getAwsSecretValue } from 'get-env';
import {
  ZaloRefreshTokenResponsePayload, ZaloUploadFileResponsePayload,
} from '../models';

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
      console.info('[ZaloMessagePlatformProvider.refreshToken] Refresh token successfully:', response.data);
      return response.data;
    }
  };

  /**
   * Upload File to Zalo OA
   * @param pageToken Page token stored in DynamoDB table
   * @param filePath The path to the file
   * @returns ZaloUploadFileResponsePayload which contain file token or attachment id
   */
  private readonly uploadFileToZaloOA = async (
    pageToken: string,
    filePath: string,
    requestPath: string,
  ): Promise<ZaloUploadFileResponsePayload | undefined> => {
    const form = new FormData();
    const stream = fs.createReadStream(filePath);
    form.append('file', stream);
    const response = await this.axiosInstance.post(
      `${this.messagePlatformBaseUrl}/oa/upload/${requestPath}`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          access_token: pageToken,
        },
      },
    );
    if (response.data.error === 0) {
      console.info(
        `[ZaloMessagePlatformProvider.uploadFileToZaloOA] The file from page ${pageToken} has been sent, response message from Message Platform`,
        response.data,
      );
      return response.data;
    }
    throw new Error(response.data.message);
  };

  /**
   * Upload file to Zalo OA
   * @param pageToken Page token stored in DynamoDB table
   * @param filePath The path to the file
   * @returns ZaloUploadFileResponsePayload which contain file token
   */
  uploadFile = async (
    pageToken: string,
    filePath: string,
  ): Promise<ZaloUploadFileResponsePayload | undefined> => {
    const requestPath = 'file';
    return this.uploadFileToZaloOA(pageToken, filePath, requestPath);
  };

  /**
   * Upload image to Zalo OA
   * @param pageToken Page token stored in DynamoDB table
   * @param filePath The path to the file
   * @returns ZaloUploadFileResponsePayload which contain attachment id
   */
  uploadImage = async (
    pageToken: string,
    filePath: string,
  ): Promise<ZaloUploadFileResponsePayload | undefined> => {
    const requestPath = 'image';
    return this.uploadFileToZaloOA(pageToken, filePath, requestPath);
  };

  /**
   * Upload gif image to Zalo OA
   * @param pageToken Page token stored in DynamoDB table
   * @param filePath The path to the file
   * @returns ZaloUploadFileResponsePayload which contain attachment id
   */
  uploadGifImage = async (
    pageToken: string,
    filePath: string,
  ): Promise<ZaloUploadFileResponsePayload | undefined> => {
    const requestPath = 'gif';
    return this.uploadFileToZaloOA(pageToken, filePath, requestPath);
  };
}
