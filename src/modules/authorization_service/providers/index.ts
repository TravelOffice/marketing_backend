import AuthPolicyProvider from './AuthPolicyProvider';
import DynamoProvider from './DynamoProvider';
import CognitoProvider from './CognitoProvider';
import AppSyncProvider from './AppSyncProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  authPolicyProvider: AuthPolicyProvider,
  appSyncProvider: AppSyncProvider,
  cognitoProvider: CognitoProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  authPolicyProvider: new AuthPolicyProvider(),
  appSyncProvider: new AppSyncProvider(),
  cognitoProvider: new CognitoProvider(),
};

export const {
  dynamoProvider,
  authPolicyProvider,
  appSyncProvider,
  cognitoProvider,
} = providers;
