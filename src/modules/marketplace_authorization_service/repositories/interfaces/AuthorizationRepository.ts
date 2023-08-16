import { AuthorizerPolicyRequest, AuthorizerReponse, ClaimVerifyResult } from '../../models';

export interface AuthorizationRepository {
  generateAllowPolicy: (policy: AuthorizerPolicyRequest) => AuthorizerReponse
  generateDenyPolicy: (
    policy: AuthorizerPolicyRequest, errorMessage: string,
  ) => AuthorizerReponse
  verifyAuthorizationToken: (token?: string) => Promise<ClaimVerifyResult>
}
