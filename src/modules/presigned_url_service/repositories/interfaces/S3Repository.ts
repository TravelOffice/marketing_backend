export interface S3Repository {
    generatePresignedUrl: (bucket: string, pageId: string, customerId: string, expires: number, fileType: string, fileName: string) => Promise<{key:string, url: string}>;
}
