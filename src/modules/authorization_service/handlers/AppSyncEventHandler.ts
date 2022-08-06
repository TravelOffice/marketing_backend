import { AuthorizerEvent, AuthorizerReponse } from '../models';
import { AppSyncAuthorizerEvent } from '../models/AppSyncAuthorizer';
import AuthorizerHandler from './AuthorizerHandler';

export default class AppSyncEventHandler extends AuthorizerHandler<AppSyncAuthorizerEvent> {
  handle = async (event: AuthorizerEvent): Promise<AuthorizerReponse> => {
    throw new Error(`Unsupported AppSync Authorizer Event ${JSON.stringify(event)}`);
  };
}
