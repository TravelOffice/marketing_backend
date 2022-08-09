/* eslint-disable max-len */
// Types shared between trigger/api-gateway-authorizer.d.ts and api-gateway-proxy.d.ts

import { APIGatewayEventClientCertificate, APIGatewayEventRequestContextWithAuthorizer } from './ApiGateway';
import { HTTP_VERB } from './RolePermission';

// Poorly documented, but API Gateway will just fail internally if
// the context type does not match this.
// Note that although non-string types will be accepted, they will be
// coerced to strings on the other side.
export interface APIGatewayAuthorizerResultContext {
  [name: string]: string | number | boolean | null | undefined;
}

export interface Condition {
  [key: string]: string | string[];
}

/**
 * API Gateway CustomAuthorizer AuthResponse.PolicyDocument.Condition.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-policy-language-overview.html
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html
 */
export interface ConditionBlock {
  [condition: string]: Condition | Condition[];
}

export interface BaseStatement {
     Effect: string;
     Sid?: string | undefined;
     Condition?: ConditionBlock;
 }

export type PrincipalValue = { [key: string]: string | string[] } | string | string[];
export interface MaybeStatementPrincipal {
     Principal?: PrincipalValue;
     NotPrincipal?: PrincipalValue;
 }
export interface MaybeStatementResource {
     Resource?: string | string[];
     NotResource?: string | string[];
 }
export type StatementAction = { Action: string | string[] } | { NotAction: string | string[] };
export type StatementResource = MaybeStatementPrincipal &
     ({ Resource: string | string[] } | { NotResource: string | string[] });
export type StatementPrincipal = MaybeStatementResource &
     ({ Principal: PrincipalValue } | { NotPrincipal: PrincipalValue });

/**
 * API Gateway CustomAuthorizer AuthResponse.PolicyDocument.Statement.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-policy-language-overview.html
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html
 */
export type Statement = BaseStatement & StatementAction & (StatementResource | StatementPrincipal);

/**
 * API Gateway CustomAuthorizer AuthResponse.PolicyDocument.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
 */
export interface PolicyDocument {
  Version: string;
  Id?: string;
  Statement: Statement[];
}

export interface APIGatewayAuthorizerResult {
  principalId: string;
  policyDocument: PolicyDocument;
  context?: APIGatewayAuthorizerResultContext;
  usageIdentifierKey?: string;
}

export interface APIGatewayRequestAuthorizerEventHeaders {
  [name: string]: string | undefined;
}

export interface APIGatewayRequestAuthorizerEventQueryStringParameters {
  [name: string]: string | undefined;
}

/**
 * Works with HTTP API integration Payload Format version 2.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export interface APIGatewayEventRequestContextV2 {
  accountId: string;
  apiId: string;
  authentication?: {
      clientCert: APIGatewayEventClientCertificate;
  };
  domainName: string;
  domainPrefix: string;
  http: {
      method: string;
      path: string;
      protocol: string;
      sourceIp: string;
      userAgent: string;
  };
  requestId: string;
  routeKey: string;
  stage: string;
  time: string;
  timeEpoch: number;
}

export interface APIGatewayRequestAuthorizerEventPathParameters {
  [name: string]: string | undefined;
}

export interface APIGatewayRequestAuthorizerEventMultiValueHeaders {
  [name: string]: string[] | undefined;
}

export interface APIGatewayRequestAuthorizerEventMultiValueQueryStringParameters {
  [name: string]: string[] | undefined;
}

export interface APIGatewayRequestAuthorizerEventStageVariables {
  [name: string]: string | undefined;
}

export interface APIGatewayTokenAuthorizerEvent {
  type: 'TOKEN';
  methodArn: string;
  authorizationToken: string;
}

// Note, when invoked by the tester in the AWS web console, the map values can be null,
// but they will be empty objects in the real object.
// Worse, it will include "body" and "isBase64Encoded" properties, unlike the real call!
// See https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html for the
// formal definition.
export interface APIGatewayRequestAuthorizerEvent {
  type: 'REQUEST';
  methodArn: string;
  resource: string;
  path: string;
  httpMethod: HTTP_VERB;
  headers: APIGatewayRequestAuthorizerEventHeaders;
  multiValueHeaders?: APIGatewayRequestAuthorizerEventMultiValueHeaders;
  pathParameters?: APIGatewayRequestAuthorizerEventPathParameters;
  queryStringParameters?: APIGatewayRequestAuthorizerEventQueryStringParameters;
  multiValueQueryStringParameters?: APIGatewayRequestAuthorizerEventMultiValueQueryStringParameters;
  stageVariables?: APIGatewayRequestAuthorizerEventStageVariables;
  requestContext: APIGatewayEventRequestContextWithAuthorizer<undefined>;
}

export type APIGatewayAuthorizerEvent = APIGatewayTokenAuthorizerEvent | APIGatewayRequestAuthorizerEvent;
