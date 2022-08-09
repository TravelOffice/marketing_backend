import { getCurrentUserInfo } from 'decode-token';
import { APIGatewayRequestAuthorizerEvent, AuthorizerReponse, Permission } from '../models';
import { authorizationRepository, rolePermissionRepository, userRepository } from '../repositories';
import { DEFAULT_DENY_MESSAGE } from '../utils/constants';
import logger from '../utils/logger';
import AuthorizerHandler from './AuthorizerHandler';

class APIGatewayRequestEventHandler extends AuthorizerHandler<APIGatewayRequestAuthorizerEvent> {
  /**
   * Verify the APIGateway authorization request event
   * - Step 1: Verify the authorization token which comes from Cognito
   * - Step 2: Get the user and tenant information
   * - Step 3: Get the user roles
   * - Step 4: Check whether the user has permission to access resource
   * @returns Return the access policy to APIGateway
   */
  handle = async (): Promise<AuthorizerReponse> => {
    logger.log(`APIGatewayRequestEventHandler: Receive event ${JSON.stringify(this.event)}`);
    const { methodArn, path, httpMethod } = this.event;
    const authorizationToken = this.event.headers.authorization;
    if (!authorizationToken) {
      throw new Error('APIGatewayRequestEventHandler: Authorization Token not found!');
    }
    const verifyTokenResult = await authorizationRepository.verifyAuthorizationToken(
      authorizationToken,
    );

    const { tenant, username } = getCurrentUserInfo(authorizationToken);
    const userAttributes = await userRepository.getUserAttributes(tenant, username);
    if (!userAttributes) throw new Error(`APIGatewayRequestEventHandler: Your account [${username}] not existed!`);

    const { roles } = userAttributes;
    const permisson: Permission = {
      path,
      action: httpMethod,
    };

    const hasPermission = await rolePermissionRepository.hasPermission(tenant, roles, permisson);
    if (hasPermission) {
      return authorizationRepository.generateAllowPolicy(
        verifyTokenResult.claim.sub,
        methodArn,
      );
    }

    return authorizationRepository.generateDenyPolicy(
      verifyTokenResult.claim.sub,
      methodArn,
      DEFAULT_DENY_MESSAGE,
    );
  };
}

export default APIGatewayRequestEventHandler;
