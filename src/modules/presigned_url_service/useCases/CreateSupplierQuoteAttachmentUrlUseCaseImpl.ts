import crypto from 'crypto';
import { s3Repository } from '../repositories';
import { CognitoUser, PresignedUrl } from '../models';
import { CreateSupplierQuoteAttachmentUrlUseCase } from './interfaces/CreateSupplierQuoteAttachmentUrlUseCase';

export default class CreateSupplierQuoteAttachmentUrlUseCaseImpl
implements CreateSupplierQuoteAttachmentUrlUseCase {
  invoke = async (
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl> => {
    const { tenant } = currentUser;
    const [, fileExtension] = fileName.split('.');
    const randomByteLength = 16;
    const uid = crypto.randomBytes(randomByteLength).toString('hex');
    const key = `${tenant}/supplier-quote-attachment/${uid}.${fileExtension}`;
    return s3Repository.generateSignedUrls(key, fileType);
  };
}
