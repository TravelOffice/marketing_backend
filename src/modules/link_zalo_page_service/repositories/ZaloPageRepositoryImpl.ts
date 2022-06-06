import AWS from 'aws';
import { generateChallenge } from 'pkce-challenge';
import * as randomstring from 'randomstring';
import { getAwsSecretValue, getEnv } from 'get-env';
import { ZaloPage } from '../models/ZaloPage';
import { dynamoProvider, zaloApiProvider } from '../providers';
import { ZaloPageRepository } from './interfaces/ZaloPageRepository';
import { TENANT_INDEX } from '../utils/constants';

export default class ZaloPageRepositoryImpl implements ZaloPageRepository {
  /**
   * Get code verifier from dynamo db
   * @param state Value to query code verifier
   * @returns code verifier
   */
  getCodeVerifierFromDynamo = async (state: string) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const item = await dynamoProvider.getItem(saleChatTable, 'Zalo#CodeVerifier', state);
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
    const callbackUrl = getEnv('CALLBACK_URL');
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
      expireIn: (new Date(Date.now() + getTokenResponse.expires_in * 1000)).getTime(),
      name: getOAInfo.name,
      description: getOAInfo.description,
      avatar: getOAInfo.avatar,
      cover: getOAInfo.cover,
      isVerified: getOAInfo.is_verified,
    };
  };

  /**
   * Save code verifier to dynamo db
   * @param codeVerifier The code contains uppercase, lowercase and number characters
   * @param state Unique id - sort key
   */
  saveCodeVerifierToDynamo = async (codeVerifier: string, state: string) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.putItem(saleChatTable, 'Zalo#CodeVerifier', state, { codeVerifier });
  };

  /**
   * Save access token to dynamo db
   * @param tenantId Id of tenant
   * @param page ZaloPage object
   */
  saveOAInfoToDynamo = async (tenantId: string, page: ZaloPage) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const linkedPages = await dynamoProvider.query({
      TableName: saleChatTable,
      KeyConditionExpression: 'pk = :pk_tenant AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_tenant': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter': { S: 'PAGE_zalo_' },
      },
    });
    if (linkedPages.Items && linkedPages.Items.length > 0) {
      // Remove previous item before insert new one
      const { sk, pk, ...rest } = AWS.DynamoDB.Converter.unmarshall(linkedPages.Items[0]);
      const linkedPage = rest as ZaloPage;
      await dynamoProvider.deleteItem(saleChatTable, `${TENANT_INDEX}#${tenantId}`, `PAGE_zalo_${linkedPage.id}`);
    }
    await dynamoProvider.putItem(saleChatTable, `${TENANT_INDEX}#${tenantId}`, `PAGE_zalo_${page.id}`, page);
  };

  /**
   * Delete code verifier after link Zalo page successfully
   * @param state Unique id - sort key
   */
  deleteCodeVerifierInDynamo = async (state: string) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.deleteItem(saleChatTable, 'Zalo#CodeVerifier', state);
  };
}
