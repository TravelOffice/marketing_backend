import AWS from 'aws';
import axios, { AxiosInstance } from 'axios';
import { getAwsSecretValue, getEnv } from 'get-env';
import logger from '../utils/logger';

export default class S3Provider {
  private readonly s3: AWS.S3;

  // Timeout for call api
  private readonly messagePlatformRequestTimeout: number = 60000;

  // Instance to call api
  private readonly axiosInstance: AxiosInstance;

  private readonly get = async (url: string, params?: Object) => {
    try {
      return this.axiosInstance.get(url, { params });
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        logger.log(`[S3Provider.get] Error: ${JSON.stringify(e)}`);
        if (e.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          logger.log(`[S3Provider.get] Server response an error with data ${JSON.stringify(e.response)}`);
        } else if (e.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          logger.log(e.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          logger.log(`[S3Provider.get] Setting up request error ${e.message}`);
        }
        logger.log(e.config);
        throw new Error(e.message);
      } else {
        throw e;
      }
    }
  };

  /**
   * Constructor, init http client to communicate Telegram Message Platform APIs
   */
  constructor() {
    AWS.config.update({
      region: getEnv('AWS_REGION'),
    });
    this.s3 = new AWS.S3();
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
    logger.log(`[S3Provider.downloadFileToS3] Downloading file: ${bucket}/${key} from filePath: ${fileUrl}`);
    await this.s3.putObject(objectParams).promise();
    logger.log(`[S3Provider.downloadFileToS3] Downloaded file: ${bucket}/${key} from filePath: ${fileUrl}`);
    const chatFileBucketUrl = await getAwsSecretValue('CHAT_FILE_BUCKET_URL');
    return `${chatFileBucketUrl}/${key}`;
  };
}
