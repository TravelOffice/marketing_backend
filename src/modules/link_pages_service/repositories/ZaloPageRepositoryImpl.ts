import { ChatPlatform, ZaloPage } from 'common-models';
import { getAwsSecretValue, getEnv } from 'get-env';
import { generateChallenge } from 'pkce-challenge';
import * as randomstring from 'randomstring';
import { dynamoProvider, zaloApiProvider } from '../providers';
import {
  PAGE_INDEX,
  TENANT_INDEX,
  ZALO_CODE_VERIFIER_INDEX,
  ZALO_CODE_VERIFIER_TTL,
  ZALO_REFRESH_TOKEN_TTL,
} from '../utils/constants';
import { ZaloPageRepository } from './interfaces/ZaloPageRepository';

export default class ZaloPageRepositoryImpl implements ZaloPageRepository {
  /**
   * Get code verifier from dynamo db
   * @param state Value to query code verifier
   * @returns code verifier
   */
  getCodeVerifierFromDynamo = async (state: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const item = await dynamoProvider.getItem(travelTable, ZALO_CODE_VERIFIER_INDEX, state);
    return item.codeVerifier;
  };

  /**
   * Generate code verifier, code challenge, state to create Zalo login url
   * @returns code challenge
   */
  generateCodeChallenge = async () => {
    const codeLength = 43;
    // random code verifier
    const codeVerifier = randomstring.generate(codeLength);
    // Generate pkce code chanllenge
    const codeChallenge = generateChallenge(codeVerifier);
    // Generate random state variable to pair code verifier and code challenge
    const state = randomstring.generate(codeLength);
    return { codeVerifier, codeChallenge, state };
  };

  /**
   * Generate Zalo login url
   * @param codeChallenge The Pkce code contains uppercase, lowercase and number characters
   * @param state Unique id to query code verifier from dynamo db
   * @returns Zalo login url
   */
  generateLoginUrl = async (codeChallenge: string, state: string) => {
    const appId = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_APP_ID');
    const callbackUrl = getEnv('ZALO_CALLBACK_URL');
    return `https://oauth.zaloapp.com/v4/oa/permission?app_id=${appId}&redirect_uri=https%3A%2F%2F${callbackUrl}&code_challenge=${codeChallenge}&state=${state}`;
  };

  /**
   * Get Zalo access token and refresh token
   * @param authorizationCode Code returned after client submiet zalo login form
   * @param codeVerifier The Pkce code queried from dynamodb
   * @param pageId The Zalo offficial account id
   * @returns accessToken, refreshToken
   */
  getOfficialAccountInfo = async (
    authorizationCode: string,
    codeVerifier: string,
    pageId: string,
  ) => {
    const getTokenResponse = await zaloApiProvider.getAccessToken(authorizationCode, codeVerifier);
    const getOAInfo = await zaloApiProvider.getOfficialAccountInfo(getTokenResponse.access_token);
    return {
      id: pageId,
      accessToken: getTokenResponse.access_token,
      refreshToken: getTokenResponse.refresh_token,
      accessTokenExpireIn: (new Date(Date.now() + getTokenResponse.expires_in * 1000)).getTime(),
      refreshTokenExpireIn: (new Date(Date.now() + ZALO_REFRESH_TOKEN_TTL)).getTime(),
      name: getOAInfo.name,
      description: getOAInfo.description,
      avatar: getOAInfo.avatar,
      cover: getOAInfo.cover,
      isVerified: getOAInfo.is_verified,
      platform: ChatPlatform.zalo,
    };
  };

  /**
   * Save code verifier to dynamo db
   * @param codeVerifier The code contains uppercase, lowercase and number characters
   * @param state Unique id - sort key
   */
  saveCodeVerifierToDynamo = async (codeVerifier: string, state: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const expireTime = new Date(Date.now() + ZALO_CODE_VERIFIER_TTL);
    const ttl = Math.round(expireTime.getTime() / 1000);
    await dynamoProvider.putItem(
      travelTable,
      ZALO_CODE_VERIFIER_INDEX,
      state,
      { codeVerifier, ttl },
    );
  };

  /**
   * Save access token to dynamo db
   * @param tenantId Id of tenant
   * @param page ZaloPage object
   */
  saveOAInfoToDynamo = async (tenantId: string, page: ZaloPage) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const zaloIndex = `${PAGE_INDEX}#${ChatPlatform.zalo.toUpperCase()}`;
    await dynamoProvider.putItem(travelTable, `${TENANT_INDEX}#${tenantId}`, `${zaloIndex}#${page.id}`, page);
  };

  /**
   * Delete code verifier after link Zalo page successfully
   * @param state Unique id - sort key
   */
  deleteCodeVerifierInDynamo = async (state: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.deleteItem(travelTable, ZALO_CODE_VERIFIER_INDEX, state);
  };
}
