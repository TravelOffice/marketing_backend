import * as crypto from 'crypto';
import { getEnv } from 'get-env';
import { GenerateAvatarPresignedUrlOption } from '../models/GenerateAvatarPresignedUrlOption';
import { GenerateMailPresignedUrlOption } from '../models/GenerateMailPresignedUrlOption';
import { s3Provider } from '../providers';
import { S3Repository } from './interfaces/S3Repository';
import { GeneratePaymentVoucherPresignedUrlOption } from '../models/GeneratePaymentVoucherPresignedUrlOption';
import { GeneratePassengerAttachedDocPresignedUrlOption } from '../models/GeneratePassengerAttachedDocPresignedUrlOption';

export default class S3RepositoryImpl implements S3Repository {
  /**
   * Generate presigned url to upload file to s3
   * @param option GenerateMailPresignedUrlOption
   * @returns PresignedUrl object
   */
  generatePresignedUrl = async (option: GenerateMailPresignedUrlOption) => {
    const randomByteLength = 16;
    const folderName = crypto.randomBytes(randomByteLength).toString('hex');
    const now = new Date();
    return s3Provider.generatePresignedUrl(option.bucket, `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/${option.pageId}/${option.customerId}/${folderName}/${option.fileName}`, option.expires, option.fileType);
  };

  /**
   * Generate pre-signed url to upload file to s3
   * @returns PresignedUrl object
   * @param key
   * @param fileType
   */
  generatePresignedUrls = async (
    key: string,
    fileType: string,
  ) => {
    const bucket = getEnv('ATTACHMENT_MESSAGE_BUCKET');
    const expires = Number(getEnv('PRESIGNED_URL_EXPIRES'));
    return s3Provider.generatePresignedUrl(bucket, key, expires, fileType);
  };

  /**
   * Generate presigned url to upload avatar to s3
   * @param option GenerateAvatarPresignedUrlOption
   * @returns PresignedUrl object
   */
  generateAvatarPresignedUrl = async (option: GenerateAvatarPresignedUrlOption) => s3Provider.generatePresignedUrl(option.bucket, `${option.tenant}/${option.username}/avatar/${option.fileName}`, option.expires, option.fileType);

  /**
   * Generate presigned url to upload payment voucher to s3
   * @param option GeneratePaymentVoucherPresignedUrlOption
   * @returns PresignedUrl object
   */
  generatePaymentVoucherPresignedUrl = async (option: GeneratePaymentVoucherPresignedUrlOption) => s3Provider.generatePresignedUrl(option.bucket, `${option.tenant}/payment-voucher/${option.fileName}`, option.expires, option.fileType);

  /**
   * Generate presigned url to upload passenger's attached document to s3
   * @param option GeneratePaymentVoucherPresignedUrlOption
   * @returns PresignedUrl object
   */
  generatePassengerAttachedDocPresignedUrl = async (
    option: GeneratePassengerAttachedDocPresignedUrlOption,
  ) => {
    const randomByteLength = 16;
    const folderName = crypto.randomBytes(randomByteLength).toString('hex');
    const now = new Date();
    return s3Provider.generatePresignedUrl(option.bucket, `${option.tenant}/passenger-attached-doc/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/${folderName}/${option.fileName}`, option.expires, option.fileType);
  };
}
