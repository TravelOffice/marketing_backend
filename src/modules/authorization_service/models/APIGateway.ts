// Types shared between trigger/api-gateway-authorizer.d.ts and api-gateway-proxy.d.ts

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
     Condition?: ConditionBlock | undefined;
 }

export type PrincipalValue = { [key: string]: string | string[] } | string | string[];
export interface MaybeStatementPrincipal {
     Principal?: PrincipalValue | undefined;
     NotPrincipal?: PrincipalValue | undefined;
 }
export interface MaybeStatementResource {
     Resource?: string | string[] | undefined;
     NotResource?: string | string[] | undefined;
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
  Id?: string | undefined;
  Statement: Statement[];
}

export interface APIGatewayAuthorizerResult {
  principalId: string;
  policyDocument: PolicyDocument;
  context?: APIGatewayAuthorizerResultContext | null | undefined;
  usageIdentifierKey?: string | null | undefined;
}

export interface APIGatewayTokenAuthorizerEvent {
  type: 'TOKEN';
  methodArn: string;
  authorizationToken: string;
}
