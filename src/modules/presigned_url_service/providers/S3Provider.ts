import * as AWS from 'aws';
import { getEnv } from 'get-env';

AWS.config.update({
  region: getEnv('AWS_REGION'),
});
const s3 = new AWS.S3();

export default class S3Provider {
  /**
   * Generate presigned url to upload object to S3
   * @param bucket S3 bucket name
   * @param key Object key after uploaded to s3
   * @param expires Expires of presigned url
   * @param fileType Only this file type is allowed to upload to s3
   * @returns s3 object key and presigned url
   */
  generatePresignedUrl = async (
    bucket: string,
    key: string,
    expires: number,
    fileType: string,
  ): Promise<{key: string, url: string}> => {
    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: bucket,
      Key: key,
      Expires: expires,
      ContentType: fileType,
    });
    return { key, url };
  };
}
