import {
  APIGatewayAuthorizerResultContext,
  AppSyncResolverResultContext,
  AuthorizerPolicyRequest,
  ClaimVerifyRequest,
} from '../models';
import { appSyncProvider, authPolicyProvider, cognitoProvider } from '../providers';
import logger from '../utils/logger';
import { AuthorizationRepository } from './interfaces/AuthorizationRepository';

export default class AuthorizationRepositoryImpl implements AuthorizationRepository {
  /**
   * Generate ALLOW policy which returned to ApiGateway
   * @param policy The authorizer policy request
   * @returns APIGatewayAuthorizerResult
   */
  generateAllowPolicy = (policy: AuthorizerPolicyRequest) => {
    logger.log(`Generate Allow Policy: policy [${JSON.stringify(policy)}]`);
    const { type } = policy;
    if (type === 'API') {
      const { principalId, resource } = policy;
      return authPolicyProvider.generatePolicy(principalId, 'Allow', resource);
    }
    if (type === 'APPSYNC') {
      const { deniedFields, ttlOverride, context } = policy;
      return appSyncProvider.generatePolicy(true, deniedFields, ttlOverride, context);
    }
    throw new Error(`generateAllowPolicy: Unsupported policy ${JSON.stringify(policy)}`);
  };

  /**
   * Generate DENY policy which returned to ApiGateway
   * @param policy The authorizer policy request
   * @param errorMessage The custom error message return to ApiGateway
   * @returns APIGatewayAuthorizerResult
   */
  generateDenyPolicy = (policy: AuthorizerPolicyRequest, errorMessage: string) => {
    logger.log(`Generate Deny Policy: policy [${JSON.stringify(policy)}]`);
    const { type } = policy;
    if (type === 'API') {
      const { principalId, resource, context } = policy;
      const resultContext: APIGatewayAuthorizerResultContext = {
        ...context,
        errorMessage,
      };
      return authPolicyProvider.generatePolicy(principalId, 'Deny', resource, resultContext);
    }
    if (type === 'APPSYNC') {
      const { deniedFields, ttlOverride, context } = policy;
      const resultContext: AppSyncResolverResultContext = {
        ...context,
        errorMessage,
      };
      return appSyncProvider.generatePolicy(false, deniedFields, ttlOverride, resultContext);
    }
    throw new Error(`generateDenyPolicy: Unsupported policy ${JSON.stringify(policy)}`);
  };

  /**
   * Verify the authorization token
   * @param token The authorization token will be verified
   * @returns ClaimVerifyResult The claim information
   */
  verifyAuthorizationToken = async (token?: string) => {
    if (!token) {
      throw new Error('verifyAuthorizationToken: Authorization Token not found!');
    }
    const verifyTokenRequest: ClaimVerifyRequest = {
      token,
    };
    return cognitoProvider.verifyAuthorizationToken(verifyTokenRequest);
  };
}
