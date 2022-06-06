import AWS from 'aws';
import { getEnv, getAwsSecretValue } from 'get-env';
import { CognitoUserRepository } from './interfaces/CognitoUserRepository';

const cognito = new AWS.CognitoIdentityServiceProvider({ region: getEnv('AWS_REGION') });

export default class CognitoUserRepositoryImpl implements CognitoUserRepository {
  /**
   * Get user attributes in cognito
   * @param username Cognito username
   * @returns List of user attributes
   */
  getCognitoUserAttributes = async (userId: string): Promise<Map<string, string> | undefined> => {
    const userPoolId = await getAwsSecretValue('COGNITO_USER_POOL_ID');
    const params = {
      Username: userId,
      UserPoolId: userPoolId,
    };
    const response = await cognito.adminGetUser(params).promise();
    if (response.UserAttributes) {
      const result = new Map(
        response.UserAttributes.map((element) => [element.Name, element.Value]),
      );
      return result as Map<string, string>;
    }
    return undefined;
  };
}
