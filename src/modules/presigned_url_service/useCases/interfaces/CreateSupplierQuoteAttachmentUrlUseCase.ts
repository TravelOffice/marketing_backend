import { CognitoUser, PresignedUrl } from '../../models';

export interface CreateSupplierQuoteAttachmentUrlUseCase {
  invoke(
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl>,
}
