import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { s3Provider } from 'core';
import logger from '../utils/logger';

const fsPromises = fs.promises;

export default class FileProvider {
  // Timeout for call api
  private readonly messagePlatformRequestTimeout: number = 60000;

  // Instance to call api
  private readonly axiosInstance: AxiosInstance;

  /**
   * Constructor, init http client to communicate Telegram Message Platform APIs
   */
  constructor() {
    this.axiosInstance = axios.create({
      timeout: this.messagePlatformRequestTimeout, // Milliseconds
      responseType: 'arraybuffer',
    });
  }

  /**
   * Download file from URL then upload to s3 storage
   * @param bucket S3 bucket name
   * @param key Object key after downloaded to s3
   * @param fileUrl The remote file url
   * @returns the path of the file which saved to s3
   */
  downloadFileToS3FromUrl = async (
    bucket: string,
    key: string,
    fileUrl: string,
  ): Promise<string> => {
    // Get file data from url
    const fileData = await this.get(fileUrl);

    // Put file data to s3
    const objectParams = {
      ContentType: fileData.headers['content-type'],
      ContentLength: parseInt(fileData.headers['content-length']!, 10),
      Body: fileData.data,
      Bucket: bucket,
      Key: key,
    };
    logger.log(`[FileProvider.downloadFileToS3] Downloading file: ${bucket}/${key} from filePath: ${fileUrl}`);
    await s3Provider.putObject(objectParams);
    logger.log(`[FileProvider.downloadFileToS3] Downloaded file: ${bucket}/${key} from filePath: ${fileUrl}`);
    return key;
  };

  /**
   * Download object from CDN url to local storage
   * @param url CDN file path
   * @returns the path of file which saved to local
   */
  downloadFileFromCDN = async (url: string): Promise<string> => {
    const randomByteLength = 16;
    const folderName = crypto.randomBytes(randomByteLength).toString('hex');
    // In cognito we using the tmp folder to save the temporary file
    const folderPath = path.join('/tmp/', folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    } else {
      throw new Error('Create a directory error, directory already exists!');
    }
    const fileNameIndex = url.lastIndexOf('/') + 1;
    const fileName = url.substring(fileNameIndex);
    const filePath = path.join(folderPath, fileName);

    logger.log(`[FileProvider.downloadFileFromCDN] Downloading ${url}`);
    const file = await this.get(url);
    await fsPromises.writeFile(filePath, file.data as Buffer);
    logger.log(`[FileProvider.downloadFileFromCDN] Downloaded ${url}`);
    return filePath;
  };

  private readonly get = async (url: string, params?: Object) => {
    try {
      return this.axiosInstance.get(url, { params });
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        logger.log(`[FileProvider.get] Error: ${JSON.stringify(e.toJSON)}`);
        if (e.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          logger.log(`[FileProvider.get] Server response an error with data ${e.response}`);
        } else if (e.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          logger.log(e.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          logger.log(`[FileProvider.get] Setting up request error ${e.message}`);
        }
        logger.log(e.config);
        throw new Error(e.message);
      } else {
        throw e;
      }
    }
  };
}
