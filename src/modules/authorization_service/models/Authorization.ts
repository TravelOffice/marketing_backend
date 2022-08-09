import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult } from './APIGatewayAuthorizer';
import { AppSyncAuthorizerEvent, AppSyncAuthorizerResult } from './AppSyncAuthorizer';

export type AuthorizerEvent = APIGatewayAuthorizerEvent | AppSyncAuthorizerEvent;

export type AuthorizerReponse = APIGatewayAuthorizerResult | AppSyncAuthorizerResult;
