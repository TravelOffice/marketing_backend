import { ZaloUploadFileResponsePayload } from '../../models';

export interface ZaloMessagePlatformRepository {
  uploadFile: (
    pageId: string,
    filePath: string,
    fileType: string,
  ) => Promise<ZaloUploadFileResponsePayload | undefined>;
}
