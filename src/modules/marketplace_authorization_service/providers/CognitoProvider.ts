import axios from 'axios';
import { getAwsSecretValue, getEnv } from 'get-env';
import jsonwebtoken from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import {
  Claim, ClaimVerifyRequest, ClaimVerifyResult, MapOfKidToPublicKey, PublicKeys, TokenHeader,
} from '../models';
import logger from '../utils/logger';

export default class CognitoProvider {
  private cacheKeys: MapOfKidToPublicKey | undefined;

  private readonly getCognitoIssuerUrl = async () => {
    const cognitoPoolId = await getAwsSecretValue('COGNITO_USER_POOL_ID');
    const awsRegion = getEnv('AWS_REGION');
    return `https://cognito-idp.${awsRegion}.amazonaws.com/${cognitoPoolId}`;
  };

  /**
   * Get the corresponding public JSON Web Key (JWK) for Cognito User Pool
   */
  private readonly getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
    if (!this.cacheKeys) {
      const cognitoIssuer = await this.getCognitoIssuerUrl();
      const url = `${cognitoIssuer}/.well-known/jwks.json`;
      const publicKeys = await axios.get<PublicKeys>(url);
      this.cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
        const pem = jwkToPem(current as any);
        const newAgg = { ...agg };
        newAgg[current.kid] = { instance: current, pem };
        return newAgg;
      }, {} as MapOfKidToPublicKey);
      return this.cacheKeys;
    }
    return this.cacheKeys;
  };

  /**
   * Verify the authorization token
   * - Step 1: Get and verify the token sections
   * - Step 2: Get the public kid
   * - Step 3: Verify the signature of the JWT token to ensure
   *           it's really coming from your User Pool
   * - Step 4: Check whether the token is expired or not
   * - Step 5: Check whether the token is an id token or not
   * @param request The claim request which contain authorization token
   * @returns ClaimVerifyResult The claim information
   */
  verifyAuthorizationToken = async (request: ClaimVerifyRequest): Promise<ClaimVerifyResult> => {
    logger.log(`[VerifyAuthorizationToken] User claim verify invoked for ${JSON.stringify(request)}`);

    const { token } = request;
    const tokenSections = token.split('.');

    if (tokenSections.length < 2) {
      throw new Error('[VerifyAuthorizationToken] Requested token is invalid');
    }

    const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
    const header = JSON.parse(headerJSON) as TokenHeader;
    const keys = await this.getPublicKeys();
    const key = keys[header.kid];

    if (!key) {
      throw new Error('[VerifyAuthorizationToken] Claim made for unknown kid');
    }

    let claim: Claim;
    try {
      // Verify the signature of the JWT token to ensure it's really coming from your User Pool
      claim = jsonwebtoken.verify(token, key.pem) as Claim;
    } catch {
      throw new Error('[VerifyAuthorizationToken] Requested token is invalid');
    }
    const currentSeconds = Math.floor((new Date()).valueOf() / 1000);

    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
      throw new Error('[VerifyAuthorizationToken] Claim is expired or invalid');
    }

    const cognitoIssuer = await this.getCognitoIssuerUrl();
    if (claim.iss !== cognitoIssuer) {
      throw new Error('[VerifyAuthorizationToken] Claim issuer is invalid');
    }

    logger.log(`[VerifyAuthorizationToken] Claim confirmed for ${JSON.stringify(claim)}`);
    return { claim };
  };
}
