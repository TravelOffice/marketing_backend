import AWS from 'aws';

const s3 = new AWS.S3();
export default class S3Provider {
  deleteObject = async (
    bucket: string,
    key: string
  ) => s3.deleteObject({
    Bucket: bucket,
    Key: key,
  }).promise();
}
