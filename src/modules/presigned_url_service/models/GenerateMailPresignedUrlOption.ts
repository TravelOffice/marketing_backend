export interface GenerateMailPresignedUrlOption {
  bucket: string, // S3 bucket name
  pageId: string, // Id of social network account
  customerId: string, // Id of customer in social network
  expires: number, // Expires of presigned url
  fileType: string, // Only this file type is allowed to upload to s3
  fileName: string, // Name of file
}
