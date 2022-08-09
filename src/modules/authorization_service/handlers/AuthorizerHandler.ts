import { AuthorizerEvent, AuthorizerReponse } from '../models';

export default abstract class AuthorizerHandler<E extends AuthorizerEvent> {
  event: E;

  constructor(event: E) {
    this.event = event;
  }

  abstract handle: (event: E) => Promise<AuthorizerReponse>;
}
