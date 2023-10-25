import { PresignedUrl } from '../../models';
import { GenerateAvatarPresignedUrlOption } from '../../models/GenerateAvatarPresignedUrlOption';
import { GenerateMailPresignedUrlOption } from '../../models/GenerateMailPresignedUrlOption';
import { GeneratePaymentVoucherPresignedUrlOption } from '../../models/GeneratePaymentVoucherPresignedUrlOption';
import {
  GeneratePassengerAttachedDocPresignedUrlOption,
} from '../../models/GeneratePassengerAttachedDocPresignedUrlOption';

export interface S3Repository {
  generateSignedUrl: (option: GenerateMailPresignedUrlOption) => Promise<PresignedUrl>;

  generateSignedUrls: (key: string, fileType: string) => Promise<PresignedUrl>;

  generateAvatarSignedUrl: (option: GenerateAvatarPresignedUrlOption) => Promise<PresignedUrl>

  generatePaymentVoucherSignedUrl: (
    option: GeneratePaymentVoucherPresignedUrlOption
  ) => Promise<PresignedUrl>

  generatePassengerAttachedDocSignedUrl: (
    option: GeneratePassengerAttachedDocPresignedUrlOption
  ) => Promise<PresignedUrl>
}
