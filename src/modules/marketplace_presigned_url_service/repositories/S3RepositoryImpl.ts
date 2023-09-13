import * as crypto from 'crypto';
import { s3Provider } from '../providers';
import { S3Repository } from './interfaces/S3Repository';
import { GeneratePresignedUrlOption } from '../models/GeneratePresignedUrlOption';

export default class S3RepositoryImpl implements S3Repository {
  /**
   * Generate pre-signed url to upload file to s3
   * @param option GeneratePresignedUrlOption
   * @returns PresignedUrl object
   */
  generatePresignedUrl = async (option: GeneratePresignedUrlOption) => {
    const randomByteLength = 16;
    const folderName = crypto.randomBytes(randomByteLength).toString('hex');
    return s3Provider.generatePresignedUrl(option.bucket, `images/${option.organization}/${folderName}/${option.fileName}`, option.expires, option.fileType);
  };
}
