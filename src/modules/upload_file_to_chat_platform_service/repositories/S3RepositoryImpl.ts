import { s3Provider } from '../providers';
import { S3Repository } from './interfaces/S3Repository';

export default class S3RepositoryImpl implements S3Repository {
  /**
   * Download object from s3 to local storage
   * @param bucket S3 bucket name
   * @param fileKey Object key after uploaded to s3
   * @returns the path of file which saved to local
   */
  downloadFileFromS3 = async (
    bucket: string,
    fileKey: string,
    fileName: string,
  ) => s3Provider.downloadFileFromS3(bucket, fileKey, fileName);

  /**
   * Delete s3 object
   * @param bucket S3 bucket name
   * @param fileKey Object key after uploaded to s3
   * @returns void
   */
  deleteObject = async (
    bucket: string,
    objectKey: string,
  ) => s3Provider.deleteObject(bucket, objectKey);
}
