import AuthPolicyProvider from './AuthPolicyProvider';
import DynamoProvider from './DynamoProvider';
import CognitoProvider from './CognitoProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  authPolicyProvider: AuthPolicyProvider,
  cognitoProvider: CognitoProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  authPolicyProvider: new AuthPolicyProvider(),
  cognitoProvider: new CognitoProvider(),
};

export const {
  dynamoProvider,
  authPolicyProvider,
  cognitoProvider,
} = providers;
