export interface PresignedUrl {
    key: string, // File path in s3 bucket
    url: string, // Signed url to upload file
    cdn: string, // CDN url to download file
}
