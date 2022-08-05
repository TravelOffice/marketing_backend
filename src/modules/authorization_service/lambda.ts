import { APIGatewayTokenAuthorizerEvent } from './models';
import { authorizationRepository } from './repositories';
import logger from './utils/logger';

/**
 * Handler for invocation from ApiGateway
 * @param event Invocation event
 * @param context Invocation context
 * @param callback Invocation callback
 */
export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: any,
  callback: any,
) => {
  const { methodArn, authorizationToken } = event;
  try {
    logger.log(`Receive ApiGateway event ${JSON.stringify(event)}`);
    const verifyTokenResult = await authorizationRepository.verifyAuthorizationToken(
      authorizationToken,
    );
    // TODO: Currently allow all request
    const authResponse = authorizationRepository.generateAllowPolicy(
      verifyTokenResult.claim.sub,
      methodArn,
    );
    callback(undefined, authResponse);
  } catch (error: any) {
    logger.log(`Generated an error: ${JSON.stringify(error)}`);
    callback('Unauthorized');
  }
};
