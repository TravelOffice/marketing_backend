import { PresignedUrl } from '../../models';

export interface S3Repository {
  generatePresignedUrl: (key: string, fileType: string) => Promise<PresignedUrl>;
}
