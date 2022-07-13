import AWS from 'aws';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { getEnv } from 'get-env';
import * as path from 'path';
import logger from '../utils/logger';

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
  downloadFileFromS3 = async (
    bucket: string,
    fileKey: string,
    fileName: string,
  ): Promise<string> => {
    const randomByteLength = 16;
    const folderName = crypto.randomBytes(randomByteLength).toString('hex');
    // In lambda we using the tmp folder to save the temporary file
    const folderPath = path.join('/tmp/', folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    } else {
      throw new Error('Create a directory error, directory already exists!');
    }

    const filePath = path.join(folderPath, fileName);

    logger.log(`[S3Provider.downloadFileFromS3] Downloading bucket: ${bucket}, filekey: ${fileKey}, filePath: ${filePath}`);
    const s3Object = await s3.getObject({ Bucket: bucket, Key: fileKey }).promise();
    await fsPromises.writeFile(filePath, s3Object.Body as Buffer);
    logger.log(`[S3Provider.downloadFileFromS3] Downloaded bucket: ${bucket}, fileKey: ${fileKey}, filePath: ${filePath}`);
    return filePath;
  };

  /**
   * Delete s3 object
   * @param bucket S3 bucket name
   * @param fileKey Object key after uploaded to s3
   * @returns void
   */
  deleteObject = async (bucket: string, objectKey: string) => {
    const objectParams = { Bucket: bucket, Key: objectKey };
    logger.log(`[S3Provider.deleteObject] Deleting bucket: ${bucket}, objectKey: ${objectKey}`);
    await s3.deleteObject(objectParams).promise();
    logger.log(`[S3Provider.deleteObject] Deleted bucket: ${bucket}, objectKey: ${objectKey}`);
  };
}
