export interface S3Repository {
    downloadFileFromS3: (bucket: string, fileKey: string, fileName: string) => Promise<string>;
    deleteObject: (bucket: string, objectKey: string) => Promise<void>;
}
