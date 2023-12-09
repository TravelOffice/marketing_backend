import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'; // ES Modules import
import { getAwsSecretValue } from 'get-env';

const client = new CognitoIdentityProviderClient();

export { DeliveryMediumType } from '@aws-sdk/client-cognito-identity-provider';

export default class CognitoProvider {
  getUserAttributes = async (userId: string): Promise<Map<string, string> | undefined> => {
    const userPoolId = await getAwsSecretValue('COGNITO_USER_POOL_ID');
    const params = {
      Username: userId,
      UserPoolId: userPoolId,
    };
    const command = new AdminGetUserCommand(params);
    const response = await client.send(command);
    if (response.UserAttributes) {
      const result = new Map(
        response.UserAttributes.map((element) => [element.Name, element.Value]),
      );
      return result as Map<string, string>;
    }
    return undefined;
  };

  createUser = async (input: AdminCreateUserCommandInput) => {
    const command = new AdminCreateUserCommand(input);
    return client.send(command);
  };

  updateUser = async (input: AdminUpdateUserAttributesCommandInput) => {
    const command = new AdminUpdateUserAttributesCommand(input);
    return client.send(command);
  };
}
