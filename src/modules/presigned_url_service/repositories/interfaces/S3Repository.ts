import { PresignedUrl } from '../../models';
import { GenerateAvatarPresignedUrlOption } from '../../models/GenerateAvatarPresignedUrlOption';
import { GenerateMailPresignedUrlOption } from '../../models/GenerateMailPresignedUrlOption';

export interface S3Repository {
  generatePresignedUrl: (option: GenerateMailPresignedUrlOption) => Promise<PresignedUrl>;

  generateAvatarPresignedUrl: (option: GenerateAvatarPresignedUrlOption) => Promise<PresignedUrl>
}
