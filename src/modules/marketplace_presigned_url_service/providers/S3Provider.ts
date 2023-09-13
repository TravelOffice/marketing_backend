import AWS from 'aws';
import { getAwsSecretValue, getEnv } from 'get-env';
import { PresignedUrl } from '../models';

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
   * @returns PresginedUrl object
   */
  generatePresignedUrl = async (
    bucket: string,
    key: string,
    expires: number,
    fileType: string,
  ): Promise<PresignedUrl> => {
    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: bucket,
      Key: key,
      Expires: expires,
      ContentType: fileType,
    });
    const cdnUrl = await getAwsSecretValue('MARKETPLACE_FILE_CDN');
    return { key, url, cdn: `${cdnUrl}/${key}` };
  };
}
