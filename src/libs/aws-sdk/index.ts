import AWSXRay from 'aws-xray-sdk-core';
import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env.development' });

let awsExport: typeof AWS;
if (process.env.NODE_ENV !== 'local') {
  const captureAWS = AWSXRay.captureAWS(AWS);
  awsExport = captureAWS;
} else {
  awsExport = AWS;
}

export default awsExport;
