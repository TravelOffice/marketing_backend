/// AWS Policy Generator creates the proper access to the function.

import { APIGatewayAuthorizerResult, APIGatewayAuthorizerResultContext } from '../models';

/// http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html
export default class AWSPolicyProvider {
  // Help function to generate an IAM policy
  generatePolicy = (
    principalId: string,
    effect: string,
    resource: string,
    context?: APIGatewayAuthorizerResultContext,
  ) : APIGatewayAuthorizerResult => ({
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  });
}
