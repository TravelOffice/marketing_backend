import AWSXRay from 'aws-xray-sdk-core';
import * as AWS from 'aws-sdk';
const captureAWS = AWSXRay.captureAWS(AWS);
export default captureAWS;
