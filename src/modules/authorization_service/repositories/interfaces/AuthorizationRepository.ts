import { APIGatewayAuthorizerResult } from 'aws-lambda';
import { ClaimVerifyResult } from '../../models';

export interface AuthorizationRepository {
  generateAllowPolicy: (principalId: string, resource: string) => APIGatewayAuthorizerResult
  generateDenyPolicy: (
    principalId: string,
    resource: string,
    errorMessage: string,
  ) => APIGatewayAuthorizerResult
  verifyAuthorizationToken: (token: string) => Promise<ClaimVerifyResult>
}
