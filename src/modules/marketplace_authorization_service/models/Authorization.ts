import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayAuthorizerResultContext } from './APIGatewayAuthorizer';
import { AppSyncAuthorizerEvent, AppSyncAuthorizerResult, AppSyncResolverResultContext } from './AppSyncAuthorizer';

export type AuthorizerEvent = APIGatewayAuthorizerEvent | AppSyncAuthorizerEvent;

export type AuthorizerReponse = APIGatewayAuthorizerResult | AppSyncAuthorizerResult;

export interface ApiGatewayPolicyRequest {
  type: 'API';
  principalId: string,
  resource: string,
  context?: APIGatewayAuthorizerResultContext;
}

export interface AppSyncPolicyRequest {
  type: 'APPSYNC';
  deniedFields?: string[],
  ttlOverride?: number,
  context?: AppSyncResolverResultContext;
}

export type AuthorizerPolicyRequest = ApiGatewayPolicyRequest | AppSyncPolicyRequest;
