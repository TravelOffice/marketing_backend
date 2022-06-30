import AWS from 'aws';
import { getEnv, getAwsSecretValue } from 'get-env';
import { User } from '../models/User';
import logger from '../utils/logger';
import { toUserAttributes } from '../utils/utils';

const cognito = new AWS.CognitoIdentityServiceProvider({ region: getEnv('AWS_REGION') });

export default class AuthProvider {
  /**
   * Create user
   * @param user information to be created
   * @returns The created user attributes
   */
  adminCreateUser = async (user: User) : Promise<User> => {
    const newUser: Partial<User> = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    };
    const params : AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest = {
      UserPoolId: await getAwsSecretValue('COGNITO_USER_POOL_ID') || '',
      Username: user.username,
      UserAttributes: toUserAttributes(newUser),
      DesiredDeliveryMediums: ['EMAIL'],
    };
    logger.log(`params: , ${JSON.stringify(params)}`);
    await cognito.adminCreateUser(params).promise();
    return user;
  };

  /**
   * Update user
   * @param user information to be updated
   * @returns The updated user attributes
   */
  adminUpdateUser = async (user: User) : Promise<User> => {
    const updatedUser: Partial<User> = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
    const params: AWS.CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest = {
      UserPoolId: await getAwsSecretValue('COGNITO_USER_POOL_ID') || '',
      Username: user.username,
      UserAttributes: toUserAttributes(updatedUser),
    };
    logger.log(`params: , ${JSON.stringify(params)}`);
    await cognito.adminUpdateUserAttributes(params).promise();
    return user;
  };
}
