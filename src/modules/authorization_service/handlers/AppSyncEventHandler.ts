import { getCurrentUserInfo } from 'decode-token';
import {
  AppSyncAuthorizerEvent,
  AppSyncPolicyRequest,
  AppSyncWhiteListOperation,
  AuthorizerReponse,
  Permission,
} from '../models';
import { appSyncProvider } from '../providers';
import { authorizationRepository, rolePermissionRepository, userRepository } from '../repositories';
import { DEFAULT_DENY_MESSAGE } from '../utils/constants';
import logger from '../utils/logger';
import AuthorizerHandler from './AuthorizerHandler';

export default class AppSyncEventHandler extends AuthorizerHandler<AppSyncAuthorizerEvent> {
  /**
   * Verify the AppSync authorization request event
   * - Step 1: Verify the authorization token which comes from Cognito
   * - Step 2: Get the user and tenant information
   * - Step 3: Get the user roles
   * - Step 4: Check and allow all AppSync WhiteList Operation
   * - Step 5: Check whether the user has permission to access resource
   * @returns Return the access policy to APIGateway
   */
  handle = async (): Promise<AuthorizerReponse> => {
    logger.log(`AppSyncEventHandler: Receive event ${JSON.stringify(this.event)}`);
    const { authorizationToken, requestContext } = this.event;

    await authorizationRepository.verifyAuthorizationToken(
      authorizationToken,
    );

    const { tenant, username } = getCurrentUserInfo(authorizationToken);
    const userAttributes = await userRepository.getUserAttributes(tenant, username);
    if (!userAttributes) throw new Error(`APIGatewayRequestEventHandler: Your account [${username}] not existed!`);

    const policy: AppSyncPolicyRequest = {
      type: 'APPSYNC',
      deniedFields: [], // TODO: deniedFields are currently not supported
      // Return the tenant user information to appsync resolver context
      context: {
        tenant,
        username,
        roles: JSON.stringify(userAttributes.roles),
      },
    };
    // Always allow AppSync WhiteList Operation
    const { operationName, queryString } = requestContext;
    if (operationName
        && AppSyncWhiteListOperation.includes(operationName)
    ) {
      return authorizationRepository.generateAllowPolicy(policy);
    }
    const { roles } = userAttributes;
    const queryOperation = appSyncProvider.parseQueryString(queryString);
    const permisson: Permission = {
      path: queryOperation.queryName,
    };

    const hasPermission = await rolePermissionRepository.hasPermission(tenant, roles, permisson);
    if (hasPermission) {
      return authorizationRepository.generateAllowPolicy(policy);
    }

    return authorizationRepository.generateDenyPolicy(policy, DEFAULT_DENY_MESSAGE);
  };
}
