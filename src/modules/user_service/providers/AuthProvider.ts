import { getAwsSecretValue } from 'get-env';
import { cognitoProvider, DeliveryMediumType } from 'core';
import { User } from '../models';
import logger from '../utils/logger';
import { toUserAttributes } from '../utils/utils';

export default class AuthProvider {
  /**
   * Create user
   * @param user information to be created
   * @returns The created user attributes
   */
  adminCreateUser = async (user: User): Promise<User> => {
    const newUser: Partial<User> = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
    };
    // Currently mark email and phone number is verified
    const userAttributes = [
      {
        Name: 'phone_number_verified',
        Value: 'true',
      }, {
        Name: 'email_verified',
        Value: 'true',
      },
      ...toUserAttributes(newUser),
    ];

    const params = {
      UserPoolId: await getAwsSecretValue('COGNITO_USER_POOL_ID') || '',
      Username: user.username,
      UserAttributes: userAttributes,
      DesiredDeliveryMediums: ['EMAIL' as DeliveryMediumType],
    };
    logger.log(`params: , ${JSON.stringify(params)}`);
    await cognitoProvider.createUser(params);
    return user;
  };

  /**
   * Update user
   * @param user information to be updated
   * @returns The updated user attributes
   */
  adminUpdateUser = async (user: User): Promise<User> => {
    const updatedUser: Partial<User> = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const params = {
      UserPoolId: await getAwsSecretValue('COGNITO_USER_POOL_ID') || '',
      Username: user.username,
      UserAttributes: toUserAttributes(updatedUser),
    };
    logger.log(`params: , ${JSON.stringify(params)}`);
    await cognitoProvider.updateUser(params);
    return user;
  };
}
