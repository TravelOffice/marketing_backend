import { APIGatewayTokenAuthorizerEvent, AuthorizerEvent, AuthorizerReponse } from '../models';
import AuthorizerHandler from './AuthorizerHandler';

class APIGatewayTokenEventHandler extends AuthorizerHandler<APIGatewayTokenAuthorizerEvent> {
  handle = async (event: AuthorizerEvent): Promise<AuthorizerReponse> => {
    throw new Error(`Unsupported ApiGateway Token Event ${JSON.stringify(event)}`);
  };
}

export default APIGatewayTokenEventHandler;
