import axios from 'axios';
import { getAwsSecretValue } from 'get-env';
import logger from '../utils/logger';

export default class ZaloApiProvider {
  private readonly axiosInstance = axios.create();

  private readonly baseAuthUrl = 'https://oauth.zaloapp.com/v4';

  private readonly baseApiUrl = 'https://openapi.zalo.me/v2.0';

  /**
   * Get Zalo access token
   * @param authorizationCode Code returned after client submiet zalo login form
   * @param codeVerifier Code verifier that generated to get zalo login page
   * @returns access_token, refresh_token, expires
   */
  getAccessToken = async (authorizationCode: string, codeVerifier: string) => {
    const appSecretKey = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_SECRET_KEY');
    const appId = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_APP_ID');
    const response = await this.axiosInstance.post(
      `${this.baseAuthUrl}/oa/access_token`,
      new URLSearchParams({
        code: authorizationCode,
        app_id: appId,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          secret_key: appSecretKey,
        },
      },
    );
    if (response.data.error) {
      throw new Error(response.data.error_name);
    } else {
      logger.log(`[ZaloApiProvider.getAccessToken] Get access token successfully: ${response.data}`);
      return response.data;
    }
  };

  /**
   * Get Zalo official account information
   * @param accessToken Access token
   * @returns
   */
  getOfficialAccountInfo = async (accessToken: string) => {
    const response = await this.axiosInstance.get(
      `${this.baseApiUrl}/oa/getoa`,
      {
        headers: {
          access_token: accessToken,
        },
      },
    );

    if (response.data.error !== 0) {
      throw new Error(response.data.message);
    } else {
      logger.log(`[ZaloApiProvider.getOfficialAccountInfo] Get official account successfully: ${response.data}`);
      return response.data.data;
    }
  };
}
