import {AuthorizerEvent} from '../models';
import APIGatewayRequestEventHandler from './APIGatewayRequestEventHandler';
import APIGatewayTokenEventHandler from './APIGatewayTokenEventHandler';
import AppSyncEventHandler from './AppSyncEventHandler';

export default class AuthorizerHandlerFactory {
  static get = (event: AuthorizerEvent) => {
    if ('type' in event) {
      // Handle APIGateway Authorizer event
      switch (event.type) {
        case 'REQUEST':
          return new APIGatewayRequestEventHandler(event);
        case 'TOKEN':
          return new APIGatewayTokenEventHandler(event);
        default:
          throw new Error(`AuthorizerHandlerFactory: Unsupported APIGateway event ${JSON.stringify(event)}`);
      }
    }

    // Handle AppSync Authorizer event
    if (event.requestContext.accountId) {
      return new AppSyncEventHandler(event);
    }

    throw new Error(`AuthorizerHandlerFactory: Unsupport event ${JSON.stringify(event)}`);
  };
}
