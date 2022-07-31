import { APIGatewayAuthorizerResultContext } from 'aws-lambda';
import { ClaimVerifyRequest } from '../models';
import { authPolicyProvider, cognitoProvider } from '../providers';
import { AuthorizationRepository } from './interfaces/AuthorizationRepository';

export default class AuthorizationRepositoryImpl implements AuthorizationRepository {
  /**
   * Generate ALLOW policy which returned to ApiGateway
   * @param principalId The policy's principal identity
   * @param resource The policy's principal resource
   * @returns APIGatewayAuthorizerResult
   */
  generateAllowPolicy = (principalId: string, resource: string) => authPolicyProvider.generatePolicy(principalId, 'Allow', resource);

  /**
   * Generate DENY policy which returned to ApiGateway
   * @param principalId The policy's principal identity
   * @param resource The policy's principal resource
   * @param errorMessage The custom error message return to ApiGateway
   * @returns APIGatewayAuthorizerResult
   */
  generateDenyPolicy = (principalId: string, resource: string, errorMessage: string) => {
    const context: APIGatewayAuthorizerResultContext = {
      errorMessage,
    };
    return authPolicyProvider.generatePolicy(principalId, 'Deny', resource, context);
  };

  /**
   * Verify the authorization token
   * @param token The authorization token will be verified
   * @returns ClaimVerifyResult The claim information
   */
  verifyAuthorizationToken = async (token: string) => {
    const verifyTokenRequest: ClaimVerifyRequest = {
      token,
    };
    return cognitoProvider.verifyAuthorizationToken(verifyTokenRequest);
  };
}
