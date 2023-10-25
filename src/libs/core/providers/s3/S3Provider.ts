import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client();

export default class S3Provider {
  deleteObject = async (
    bucket: string,
    key: string,
  ) => {
    const input = {
      Bucket: bucket,
      Key: key,
    };

    const command = new DeleteObjectCommand(input);
    return client.send(command);
  };
}
