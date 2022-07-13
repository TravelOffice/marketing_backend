import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { ZaloUploadFileResponsePayload } from '../models';
import { dynamoProvider, zaloMessagePlatformProvider } from '../providers';
import { SupportedFileType } from '../utils/constants';
import logger from '../utils/logger';
import { ZaloMessagePlatformRepository } from './interfaces/ZaloMessagePlatformRepository';

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
      // Filter the item startwith `PAGE_zalo_` to make sure the item is Zalo token
      // Prevent the same token with other providers such as Facebook, Telegram
      FilterExpression: 'begins_with(#sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        // Given page id
        ':id': pageId,
        // Prefix to Zalo item
        ':sk_filter_value': 'PAGE_zalo_',
      },
      ProjectionExpression: 'pk,sk,accessToken,refreshToken,id,expireIn',
    };
    const rs = await dynamoProvider.query(params);
    if (rs.Items && rs.Items?.length > 0) {
      const dynamoItem = rs.Items[0];
      console.info('[ZaloMessagePlatformRepositoryImpl.getZaloMessagePlatformToken] DynamoDB item', dynamoItem);
      if (dynamoItem.expireIn > Date.now()) {
        return dynamoItem.accessToken;
      }
      const refreshTokenResponse = await zaloMessagePlatformProvider.refreshToken(
        dynamoItem.refreshToken,
      );
      if (refreshTokenResponse) {
        const expireIn = new Date(Date.now() + refreshTokenResponse.expires_in * 1000);
        const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
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
   * Upload file to zalo provider
   * @param pageId Page id
   * @param filePath path of file upload
   */
  uploadFile = async (
    pageId: string,
    filePath: string,
    fileType: string,
  ): Promise<ZaloUploadFileResponsePayload | undefined> => {
    try {
      // Get page token that stored in DynamoDB table by `pageIdAsSender`
      const pageToken = await this.getZaloMessagePlatformToken(pageId);
      switch (fileType) {
        case SupportedFileType.FILE:
          return await zaloMessagePlatformProvider.uploadFile(pageToken, filePath);
        case SupportedFileType.IMAGE:
          return await zaloMessagePlatformProvider.uploadImage(pageToken, filePath);
        case SupportedFileType.GIF:
          return await zaloMessagePlatformProvider.uploadGifImage(pageToken, filePath);
        default:
          throw new Error(`[ZaloMessagePlatformRepositoryImpl.uploadFile] not support file type ${fileType}`);
      }
    } catch (error) {
      logger.log(`[ZaloMessagePlatformRepositoryImpl.uploadFile] Generated an error ${error}`);
      throw error;
    }
  };
}
