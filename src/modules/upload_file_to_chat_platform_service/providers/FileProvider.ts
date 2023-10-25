import { s3Provider } from 'core';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../utils/logger';

const fsPromises = fs.promises;

export default class FileProvider {
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
    // In cognito we using the tmp folder to save the temporary file
    const folderPath = path.join('/tmp/', folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    } else {
      throw new Error('Create a directory error, directory already exists!');
    }

    const filePath = path.join(folderPath, fileName);

    logger.log(`[S3Provider.downloadFileFromS3] Downloading bucket: ${bucket}, filekey: ${fileKey}, filePath: ${filePath}`);
    const s3Object = await s3Provider.getObject(bucket, fileKey);
    if (s3Object) {
      const { Body } = s3Object;
      const arrayBuffer = await Body?.transformToByteArray();
      await fsPromises.writeFile(filePath, arrayBuffer!);
      logger.log(`[S3Provider.downloadFileFromS3] Downloaded bucket: ${bucket}, fileKey: ${fileKey}, filePath: ${filePath}`);
      return filePath;
    }
    throw new Error(`File ${fileKey} doesn't exist`);
  };

  /**
   * Delete s3 object
   * @param bucket S3 bucket name
   * @param objectKey Object key after uploaded to s3
   * @returns void
   */
  deleteObject = async (bucket: string, objectKey: string) => {
    logger.log(`[S3Provider.deleteObject] Deleting bucket: ${bucket}, objectKey: ${objectKey}`);
    await s3Provider.deleteObject(bucket, objectKey);
    logger.log(`[S3Provider.deleteObject] Deleted bucket: ${bucket}, objectKey: ${objectKey}`);
  };
}
