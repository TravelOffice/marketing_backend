import {
  LANGUAGES_TYPE, ROLES_TYPE, THEMES_TYPE, User,
} from '../models/User';
import { userRepository } from '../repositories';
import { CreateTenantUserUseCase } from './interfaces/CreateTenantUserUseCase';

export default class CreateTenantUserUseCaseImpl implements CreateTenantUserUseCase {
  /**
   * Method to create Tenant user
   * To create Tenant user, there are steps need to do:
   * - Step 1: Confirm the authenticated user information exists in Dynamo DB
   * - Step 2: Get the current tenant from authenticated user
   * - Step 3: TODO check the permission of authenticated user
   * - Step 4: Check whether user to be created exists or not
   * - Step 5: Create the user with the default settings
   * @param authenticatedUserName The id of the authenticated user
   * @param user The user information to be created
   * @returns Promise<User> All information of created user
   */
  invoke = async (authenticatedUserName: string, user: User) => {
    const userAttributes = await userRepository.getUserAttributes(authenticatedUserName);
    if (!userAttributes) throw new Error(`Your account [${authenticatedUserName}] not existed!`);

    const tenantId = userAttributes.tenant;
    if (!tenantId) throw new Error(`User [${authenticatedUserName}] is missing tenant attribute`);

    // Confirm user does not exist
    const existingUser = await userRepository.getUserAttributes(user.username);
    if (existingUser) throw new Error(`User [${user.username}] already existed!`);

    const newUser:User = {
      ...user,
      username: user.username,
      tenant: tenantId,
      role: user.role || ROLES_TYPE.EMPLOYEE,
      settings: {
        theme: THEMES_TYPE.LIGHT,
        language: LANGUAGES_TYPE.VIETNAMESE,
      },
    };

    return userRepository.create(tenantId, newUser);
  };
}
