import { PresignedUrl } from '../../models';
import { GeneratePresignedUrlOption } from '../../models/GeneratePresignedUrlOption';

export interface S3Repository {
  generatePresignedUrl: (option: GeneratePresignedUrlOption) => Promise<PresignedUrl>;
}
