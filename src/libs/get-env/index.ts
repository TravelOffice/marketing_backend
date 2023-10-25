import {GetSecretValueCommand, SecretsManagerClient} from '@aws-sdk/client-secrets-manager';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({path: process.cwd() + '/.env.development'});
const client = new SecretsManagerClient();

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

export async function getAwsSecretValue(key: string, secretId?: string): Promise<string> {
  let secretValue;
  if (!isLocalEnv()) {
    if (!secretValues) {
      secretId = secretId || process.env.SECRET_MANAGER_ID;
      if (secretId) {
        const command = new GetSecretValueCommand({
          SecretId: secretId,
        })
        const data = await client.send(command);
        secretValues = JSON.parse(data.SecretString || {}.toString());
      }
    }
    secretValue = secretValues[key];
  } else {
    const content = fs.readFileSync(process.cwd() + '/.env.awslocal');
    const values = dotenv.parse(content);
    secretValue = values[key];
  }
  return secretValue || '';
}

export function getEnv(key: string): string {
  return process.env[key] || '';
}
