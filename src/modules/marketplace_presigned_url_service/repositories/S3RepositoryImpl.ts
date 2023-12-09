import { s3Provider } from 'core';
import { getAwsSecretValue, getEnv } from 'get-env';
import { S3Repository } from './interfaces/S3Repository';

export default class S3RepositoryImpl implements S3Repository {
  /**
   * Generate pre-signed url to upload file to s3
   * @returns PresignedUrl object
   * @param key
   * @param fileType
   */
  generatePresignedUrl = async (
    key: string,
    fileType: string,
  ) => {
    const bucket = await getAwsSecretValue('MARKETPLACE_FILE_BUCKET');
    const expires = Number(getEnv('PRESIGNED_URL_EXPIRES'));
    const cdnUrl = await getAwsSecretValue('MARKETPLACE_FILE_CDN');
    return s3Provider.generateSignedUrl(bucket, key, expires, fileType, cdnUrl);
  };
}
