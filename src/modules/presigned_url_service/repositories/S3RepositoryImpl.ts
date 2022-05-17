import * as crypto from 'crypto';
import { s3Provider } from '../providers';
import { S3Repository } from './interfaces/S3Repository';

export default class S3RepositoryImpl implements S3Repository {
  /**
   * Generate presigned url to upload file to s3
   * @param bucket S3 bucket name
   * @param pageId Id of social network account
   * @param customerId Id of customer in social network
   * @param expires Expires of presigned url
   * @param fileType Only this file type is allowed to upload to s3
   * @returns s3 object key and presigned url
   */
  generatePresignedUrl = async (
    bucket: string,
    pageId: string,
    customerId: string,
    expires: number,
    fileType: string,
    fileName: string,
  ) => {
    const randomByteLength = 16;
    const folderName = crypto.randomBytes(randomByteLength).toString('hex');
    const now = new Date();
    return s3Provider.generatePresignedUrl(bucket, `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/${pageId}/${customerId}/${folderName}/${fileName}`, expires, fileType);
  };
}
