import { getAwsSecretValue, getEnv } from 'get-env';
import { s3Provider } from '../providers';
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
    return s3Provider.generatePresignedUrl(bucket, key, expires, fileType);
  };
}
