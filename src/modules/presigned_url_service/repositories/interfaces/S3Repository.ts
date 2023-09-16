import { PresignedUrl } from '../../models';
import { GenerateAvatarPresignedUrlOption } from '../../models/GenerateAvatarPresignedUrlOption';
import { GenerateMailPresignedUrlOption } from '../../models/GenerateMailPresignedUrlOption';
import { GeneratePaymentVoucherPresignedUrlOption } from '../../models/GeneratePaymentVoucherPresignedUrlOption';
import {
  GeneratePassengerAttachedDocPresignedUrlOption,
} from '../../models/GeneratePassengerAttachedDocPresignedUrlOption';

export interface S3Repository {
  generatePresignedUrl: (option: GenerateMailPresignedUrlOption) => Promise<PresignedUrl>;

  generatePresignedUrls: (key: string, fileType: string) => Promise<PresignedUrl>;

  generateAvatarPresignedUrl: (option: GenerateAvatarPresignedUrlOption) => Promise<PresignedUrl>

  generatePaymentVoucherPresignedUrl: (
    option: GeneratePaymentVoucherPresignedUrlOption
  ) => Promise<PresignedUrl>

  generatePassengerAttachedDocPresignedUrl: (
    option: GeneratePassengerAttachedDocPresignedUrlOption
  ) => Promise<PresignedUrl>
}
