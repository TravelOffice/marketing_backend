export interface PresignedUrl {
  key: string, // File path in s3 bucket
  url: string, // Signed url to upload file
  cdn: string, // CDN url to download file
}

export enum PresignedUrlType {
  SUPPLIER_QUOTE_ATTACHMENT = 'SUPPLIER_QUOTE_ATTACHMENT',
}

export const presignedUrlTypes = Object.keys(PresignedUrlType);
