import AuthorizerHandlerFactory from './handlers/AuthorizerHandlerFactory';
import { AuthorizerEvent } from './models';
import logger from './utils/logger';

/**
 * Handler for invocation from ApiGateway
 * @param event Invocation event
 * @param context Invocation context
 * @param callback Invocation callback
 */
export const handler = async (
  event: AuthorizerEvent,
  context: any,
  callback: any,
) => {
  try {
    const authorizerHandler = AuthorizerHandlerFactory.get(event);
    const authResponse = await authorizerHandler.handle(event);
    callback(undefined, authResponse);
  } catch (error: any) {
    logger.log(`Generated an error: ${error.message}`);
    callback('Unauthorized');
  }
};
