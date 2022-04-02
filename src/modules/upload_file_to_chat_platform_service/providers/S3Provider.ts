import * as AWS from 'aws';
import * as fs from 'fs';
import { getEnv } from 'get-env';
import * as path from 'path';

AWS.config.update({
  region: getEnv('AWS_REGION'),
});
const s3 = new AWS.S3();
const fsPromises = fs.promises;

export default class S3Provider {
  /**
   * Download object from s3 to local storage
   * @param bucket S3 bucket name
   * @param key Object key after uploaded to s3
   * @returns the path of file which saved to local
   */
   downloadFileFromS3 = async (bucket: string, fileKey: string, fileName: string): Promise<string> => {
    const filePath = path.join(__dirname, fileName);
    console.log('[S3Provider.downloadFileFromS3 ] Downloading', bucket, fileKey, filePath);
    const s3Object = await s3.getObject({Bucket: bucket, Key: fileKey}).promise();
    const data = s3Object?.Body?.toString('utf-8');
    await fsPromises.writeFile(filePath, String(data) , 'utf8');
    return filePath;
  };
}
