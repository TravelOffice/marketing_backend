export interface GeneratePaymentVoucherPresignedUrlOption {
  bucket: string, // S3 bucket name
  tenant: string, // ID of tenant
  expires: number, // Expires of presigned url
  fileType: string, // Only this file type is allowed to upload to s3
  fileName: string, // Name of file
}
