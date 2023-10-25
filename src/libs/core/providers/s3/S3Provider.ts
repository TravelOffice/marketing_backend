import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

  getObject = async (
    bucket: string,
    key: string,
  ) => {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return client.send(command);
  };

  putObject = async (input: PutObjectCommandInput) => {
    const command = new PutObjectCommand(input);
    return client.send(command);
  };

  generateSignedUrl = async (
    bucket: string,
    key: string,
    expires: number,
    fileType: string,
    cdnUrl: string,
  ) => {
    const getObjectParams = {
      Bucket: bucket,
      Key: key,
      Expires: expires,
      ContentType: fileType,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return { key, url, cdn: `${cdnUrl}/${key}` };
  };
}
