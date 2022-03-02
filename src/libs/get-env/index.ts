import * as AWS from 'aws';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: process.cwd() + '/.env.development' });
const client = new AWS.SecretsManager({});
let secretValues: any;
export function isAwsEnv() {
  return !!process.env.AWS_REGION;
}

export function isDevEnv() {
  const env = process.env.NODE_ENV;
  if (!env) {
    throw new Error('Please specify the dev or prod environment!');
  }
  return env === 'dev';
}

export function isLocalEnv() {
  return process.env.NODE_ENV === 'local';
}

export async function getAwsSecretValue(key: string): Promise<string> {
  let secretValue;
  if (!isLocalEnv()) {
    if (!secretValues) {
      const secretId = process.env.SECRET_MANAGER_ID;
      if (secretId) {
        const data = await client.getSecretValue({ SecretId: secretId }).promise();
        secretValues = JSON.parse(data.SecretString || {}.toString());
      }
    }
    secretValue = secretValues[key];
  } else {
    const content = await fs.readFileSync(process.cwd() + '/.env.awslocal');
    const values = dotenv.parse(content);
    secretValue = values[key];
  }
  return secretValue || '';
}

export function getEnv(key: string): string {
  return process.env[key] || '';
}